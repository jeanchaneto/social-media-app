import {
  FirebaseError,
  IPost,
  NewUser,
  PostFormValues,
  UpdatePostFormValues,
  UserLogin,
} from "@/types";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  addDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  arrayRemove,
  arrayUnion,
  deleteDoc,
  where,
} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

//Config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

//Initialize storage
const storage = getStorage();

//Authentication
export const auth = getAuth(app);

//Sign In
export const loginEmailPassword = async (userLogin: UserLogin) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      userLogin.email,
      userLogin.password
    );
    const user = userCredential.user;
    return user;
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const errorCode = firebaseError.code;
    const errorMessage = firebaseError.message;
    console.log(errorCode);
    console.log(errorMessage);
  }
};

//Create account
export const createUserAccount = async (newUser: NewUser) => {
  try {
    //Create new user with password & email
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      newUser.email,
      newUser.password
    );

    // Get the newly created user
    const user = userCredential.user;

    // Create a document in Firestore in the "users" collection with the UID as the document ID
    await setDoc(doc(db, "users", user.uid), {
      username: newUser.username,
      name: newUser.name,
      email: newUser.email,
    });
    return user;
  } catch (error) {
    const firebaseError = error as FirebaseError;
    const errorCode = firebaseError.code;
    const errorMessage = firebaseError.message;
    console.log(errorCode);
    console.log(errorMessage);
  }
};

//Log out
export const logOut = async () => {
  await signOut(auth);
};

//Get user data
export const getUserData = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return {
        id: userDocSnap.id,
        ...userDocSnap.data(),
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.log(error);
  }
};

//Convert tags to array of lowercase strings
const convertToTagArray = (tags: string) => {
  const tagsArray = tags.split(",").map((tag: string) => {
    return tag.trim().toLowerCase();
  });
  return tagsArray;
};

//Create post
export const createPost = async (values: PostFormValues, userId: string) => {
  if (values.file && values.file.length > 0) {
    //Create unique ID for storage path
    const uniqueFileName = `${uuidv4()}-${values.file[0].name}`;
    // Upload file to Firebase Storage
    const fileRef = ref(storage, `uploads/${uniqueFileName}`);
    const uploadResult = await uploadBytes(fileRef, values.file[0]);
    const fileUrl = await getDownloadURL(uploadResult.ref);

    // Create Firestore document
    const postDoc = {
      caption: values.caption,
      imageUrl: fileUrl,
      location: values.location,
      tags: convertToTagArray(values.tags),
      createdAt: serverTimestamp(),
      likes: [],
      userId,
    };
    await addDoc(collection(db, "posts"), postDoc);
  }
};

//Update post
export const updatePost = async (postId: string, updatedValues: UpdatePostFormValues) => {
  try {
    const postRef = doc(db, "posts", postId);

    // If the post includes a new file, upload it and get the URL
    let fileUrl = updatedValues.imageUrl; // Default to existing image URL
    if (updatedValues.file && updatedValues.file.length > 0) {
      const uniqueFileName = `${uuidv4()}-${updatedValues.file[0].name}`;
      const fileRef = ref(storage, `uploads/${uniqueFileName}`);
      const uploadResult = await uploadBytes(fileRef, updatedValues.file[0]);
      fileUrl = await getDownloadURL(uploadResult.ref); // Update file URL
    }

    // Prepare the updated post data
    const updatedPost = {
      caption: updatedValues.caption,
      imageUrl: fileUrl,
      location: updatedValues.location,
      tags: convertToTagArray(updatedValues.tags),
    };

    // Update the post document
    await updateDoc(postRef, updatedPost);
  } catch (error) {
    console.error("Error updating post: ", error);
    throw error;
  }
};

//Delete post
export const deletePost = async (postId: string, imageUrl: string) => {
  try {
    // Create a reference to the post document
    const postRef = doc(db, "posts", postId);

    // Delete the post document from Firestore
    await deleteDoc(postRef);

    // If the post has an associated image, delete it from Firebase Storage
    if (imageUrl) {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    }
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
};

//Get latest posts
export const getLatestPosts = async () => {
  try {
    // Create a query against the "posts" collection
    const postsQuery = query(
      collection(db, "posts"),
      orderBy("createdAt", "desc"), // Order by createdAt timestamp in descending order
      limit(20) // Limit to 20 posts
    );

    // Execute the query
    const querySnapshot = await getDocs(postsQuery);

    // Map over the documents and return the data
    const posts: IPost[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        caption: data.caption,
        imageUrl: data.imageUrl,
        location: data.location,
        tags: data.tags,
        userId: data.userId,
        createdAt: data.createdAt,
        likes: data.likes,
      };
    });

    return posts;
  } catch (error) {
    console.error("Error getting latest posts: ", error);
    throw error;
  }
};

//get post by ID
export const getPostById = async (postId: string): Promise<IPost | null> => {
  try {
    // Create a reference to the post document
    const postRef = doc(db, "posts", postId);

    // Retrieve the document
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      // Combine the document ID with the document data
      const data = postSnap.data();
      return {
        id: postSnap.id,
        caption: data.caption,
        imageUrl: data.imageUrl,
        location: data.location,
        tags: data.tags,
        userId: data.userId,
        createdAt: data.createdAt,
        likes: data.likes,
      };
    } else {
      // Handle the case where the document does not exist
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    // Handle any errors in fetching the document
    console.error("Error getting document:", error);
    throw error;
  }
};

//Like post
export const likePost = async (
  postId: string,
  userId: string,
  alreadyLiked: boolean
) => {
  const postRef = doc(db, "posts", postId);

  try {
    if (alreadyLiked) {
      // User already liked the post, so remove their like
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
      });
    } else {
      // User hasn't liked the post, so add their like
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
      });
    }
  } catch (error) {
    console.log("Error updating like status: ", error);
  }
};

// Function to save a post
export const savePost = async (postId: string, userId: string) => {
  // Create references to the post and user documents
  const postRef = doc(db, "posts", postId);
  const userRef = doc(db, "users", userId);

  // Add a new document in the "saves" collection with these references
  const docRef = await addDoc(collection(db, "saves"), {
    postRef: postRef,
    userRef: userRef
  });

  return docRef; // Return the document reference
};

// Function to unsave a post
export const unsavePost = async (postId: string, userId: string) => {
  const savesQuery = query(
    collection(db, "saves"),
    where("postId", "==", postId),
    where("userId", "==", userId)
  );
  const querySnapshot = await getDocs(savesQuery);
  querySnapshot.forEach((doc) => {
    deleteDoc(doc.ref);
  });
  return querySnapshot.docs.map((doc) => doc.ref); // Return the document references of unsaved posts
};

// Get saved posts
export const getSavedPosts = async (userId: string) => {
  try {
    // Reference to the user document
    const userRef = doc(db, "users", userId);

    // Query the "saves" collection for documents where 'userRef' matches the user reference
    const savedQuery = query(collection(db, "saves"), where("userRef", "==", userRef));
    const querySnapshot = await getDocs(savedQuery);

    // Fetch each corresponding post using the postRef
    const posts = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const savedData = doc.data();
      const postSnap = await getDoc(savedData.postRef);

      return postSnap.exists() ? { id: postSnap.id, ...postSnap.data()! } : null;
    }));

    // Filter out any null values (in case a post was not found)
    return posts.filter(post => post !== null) as IPost[];
  } catch (error) {
    console.error("Error fetching saved posts: ", error);
    throw error;
  }
};