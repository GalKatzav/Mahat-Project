import React, { useState } from "react";
import { firebase } from "../../services/firebase/FireStore"; // Ensure this is your correct Firebase config file
import "firebase/auth";
import "firebase/database";
import "../screensCSS/Settings.css"; // Make sure this CSS file exists and has the styles you want

function Settings() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    subscribe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Assuming you have a user ID to use as a key
    const userId = firebase.auth().currentUser.uid;

    // Update profile in Firebase
    firebase
      .database()
      .ref("users/" + userId)
      .set(
        {
          fullName: profile.fullName,
          email: profile.email,
          password: profile.password, // Be careful with storing passwords; consider using Firebase Authentication
          phone: profile.phone,
          subscribe: profile.subscribe,
        },
        (error) => {
          if (error) {
            // The write failed...
            console.error("Failed to update profile:", error);
          } else {
            // Data saved successfully!
            console.log("Profile updated successfully!");
          }
        }
      );
  };

  return (
    <div className="profile-settings">
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>fullName</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label>email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label>password</label>
          <input
            type="password"
            name="password"
            value={profile.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label>phone</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <label>Want to receive updates by SMS</label>
          <input
            type="checkbox"
            name="subscribe"
            checked={profile.subscribe}
            onChange={handleChange}
          />
        </div>
        <div className="form-control">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
