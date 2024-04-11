import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // נסה לטעון את המשתמש מ-localStorage בעת טעינת הקומפוננטה
  const [user, setUser] = useState(() => {
    try {
      const localUser = localStorage.getItem("user");
      return localUser ? JSON.parse(localUser) : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  });

  // שמירת המשתמש ב-localStorage בכל פעם שהמשתמש משתנה
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
