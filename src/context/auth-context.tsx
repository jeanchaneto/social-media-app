import React, { createContext, useState, useEffect, ReactNode } from "react";
import { auth, getUserData } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { User as FirebaseUser } from "firebase/auth";
import { User } from "@/types";

type AdditionalUserData = User;

// Define the shape of the context data
type AuthContextType = {
  currentUser: FirebaseUser | null;
  userData: AdditionalUserData | null;
};

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
});

// Define the types for the AuthProvider's props
type AuthProviderProps = {
  children: ReactNode;
};

// Create the AuthProvider component with proper typing
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<AdditionalUserData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const additionalData = await getUserData(user.uid);
        if (additionalData) {
          setUserData(additionalData as User);
        }
      } else {
        setUserData(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userData }}>
      {children}
    </AuthContext.Provider>
  );
};
