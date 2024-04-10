import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "../screensCSS/LogIn.css"; // Ensure your CSS path is correct

const Login = () => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Initialize the navigation hook

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your login logic here
    console.log(userName, password);
    // Possibly navigate to another route on successful login
    // navigate('/dashboard'); // Example route on successful login
  };

  // Function to navigate to the Registration page
  const handleRegistrationClick = () => {
    navigate("/Registertion"); // Use the path you've set up in your Routes for the registration page
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>User Login</h2>
        <div className="input-container">
          <input
            type="text"
            id="userName"
            name="userName"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="userName"
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
        {/* Instead of a Link, use a button for registration and handle click */}
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
