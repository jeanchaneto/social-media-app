import { FirebaseError, NewUser } from "@/types";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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

//Authentication
export const auth = getAuth(app);

//Sign In
export const loginEmailPassword = async (
  loginEmail: string,
  loginPassword: string
) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      loginEmail,
      loginPassword
    );
    const user = userCredential.user;
    console.log(user)
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

// //Authentication State
// export const monitorAuthState = async () => {
//   onAuthStateChanged(auth, (user) => {
//     if (user) {
//       console.log(user);
//       //Logged in logic
//     } else {
//       console.log("Not logged in");
//       //Not logged logic
//     }
//   });
// };

//Log out
export const logOut = async () => {
  await signOut(auth);
};
