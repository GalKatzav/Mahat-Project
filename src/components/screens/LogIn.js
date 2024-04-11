import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../screensCSS/LogIn.css";
import { firebase } from "../../services/firebase/FireStore";
import { getDocs, collection, addDoc } from "firebase/firestore";

const Login = () => {
  const [users, setUsers] = useState([]);
  const usersCollectionReference = collection(firebase, "users");
  const [email, setEmail] = useState(""); // Use email for login, adjust as needed if using userName
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(usersCollectionReference);
      setUsers(querySnapshot.docs.map((doc) => doc.data()));
    };

    fetchUsers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Assuming your user documents have 'email' and 'password' fields
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      alert("Welcome!");
      navigate("/"); // Navigate to the home page or dashboard
    } else {
      alert("Invalid login credentials."); // Handle invalid login
    }
  };

  const handleRegistrationClick = () => {
    navigate("/Registertion"); // Ensure the path is correct for your registration page
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>User Login</h2>
        <div className="input-container">
          <input
            type="text"
            id="email" // Changed to email for clarity; adjust as necessary
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" // Placeholder changed to Email for clarity
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
