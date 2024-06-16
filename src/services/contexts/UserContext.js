import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const localUser = localStorage.getItem("user");
      return localUser ? JSON.parse(localUser) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = { id: firebaseUser.uid, email: firebaseUser.email };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.log(error);
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
