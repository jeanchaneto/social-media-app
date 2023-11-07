import {
  FirebaseError,
  IPost,
  NewUser,
  PostFormValues,
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
} from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
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
//create reference to root of storage bucket
const storageRef = ref(storage);

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
      likes:[],
      userId,
    };
    await addDoc(collection(db, "posts"), postDoc);
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
        likes: data.likes
      };
    });

    return posts;
  } catch (error) {
    console.error("Error getting latest posts: ", error);
    throw error;
  }
};

//Like post
export const likePost = async (postId: string, userId: string, alreadyLiked: boolean) => {
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
  }} catch(error) {
    console.log("Error updating like status: ", error)
  }
};
