import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { useAuth } from "./AuthContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { firebase } from "../../services/firebase/FireStore"; // Adjust the path to your Firestore file

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [user, setUser] = useState(() => {
    try {
      const localUser = localStorage.getItem("user");
      return localUser ? JSON.parse(localUser) : currentUser;
    } catch (error) {
      console.log(error);
      return currentUser;
    }
  });

  const userFetchedRef = useRef(false);

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && !userFetchedRef.current) {
        const q = query(
          collection(firebase, "users"),
          where("email", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const userData = { docId: userDoc.id, ...userDoc.data() };
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

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
