import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const auth = getAuth();
  const [authCallsCount, setAuthCallsCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged called with user:", user);
      setCurrentUser(user);
      setAuthCallsCount((prevCount) => prevCount + 1);
      if (user) {
        const userData = { uid: user.uid, email: user.email }; // Add more fields if necessary
        setCurrentUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    console.log("Auth calls count:", authCallsCount); // Log to track the number of auth calls
  }, [authCallsCount]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, auth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
