import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../screensCSS/LogIn.css";
import { useUser } from "../../services/contexts/UserContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useUser();
  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch the user document from Firestore by email
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = { id: user.uid, docId: userDoc.id, ...userDoc.data() };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("User document ID:", userDoc.id); // Debug log for document ID

        // Fetch user messages and store in LocalStorage
        const messagesQuery = query(
          collection(db, "messages"),
          where("receiverId", "==", userDoc.id)
        );
        const messagesSnapshot = await getDocs(messagesQuery);
        const messages = messagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        localStorage.setItem("messages", JSON.stringify(messages));

        alert("Welcome!");
        navigate("/");
      } else {
        alert("User not found in Firestore.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Invalid login credentials.");
    }
  };

  const handleRegistrationClick = () => {
    navigate("/Registertion");
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>User Login</h2>
        <div className="input-container">
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <button
          type="button"
          className="reg-button"
          onClick={handleRegistrationClick}
        >
          Registration
        </button>
      </form>
      <div className="text-login">
        <p>
          Now is the perfect opportunity for you to open your heart and make a
          donation to families in need. Your contribution can make a significant
          difference, without requiring you to spend large sums. A donation can
          improve the daily lives of those who need our help. If you've always
          wanted to assist but didn't know where to donate, our organization
          supports families and teenagers struggling with life's challenges.
        </p>
        <p>
          We believe in sincere donations that make a difference both
          immediately and over the long term. To achieve this, we operate aid
          centers in various regions across the country, ensuring that families
          receive food baskets and baby products monthly. In addition, our
          centers offer assistance with clothing and footwear, furniture,
          financial matters, legal aid, and—equally important—mental support,
          providing an attentive ear around the clock.
        </p>
      </div>
    </div>
  );
};

export default Login;
