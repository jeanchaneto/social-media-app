import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

// Define the shape of the context data
type AuthContextType = {
  currentUser: User | null;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType>({ currentUser: null });

// Define the types for the AuthProvider's props
type AuthProviderProps = {
  children: ReactNode;
}

// Create the AuthProvider component with proper typing
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
