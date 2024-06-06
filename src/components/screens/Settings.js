import React, { useState, useEffect } from "react";
import "../screensCSS/Settings.css"; // Update with your actual path to the CSS file
import { firebase } from "../../services/firebase/FireStore";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "../../services/contexts/UserContext"; // Adjust the import path as necessary

function Settings() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    district: "",
    subscribe: false,
  });

  const { user } = useUser(); // Get the current user's info

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user.id) {
          console.error("No user ID found in user context");
          return;
        }
        console.log("User ID from context:", user.id); // Debug log
        const userDocRef = doc(firebase, "users", user.id); // Use user ID from Firebase
        console.log("Fetching profile for user ID:", user.id); // Debug log
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          console.log("Fetched user data:", userData); // Debug log
          setProfile((prevProfile) => ({
            ...prevProfile,
            ...userData,
          }));
        } else {
          console.error("No such document!"); // Debug log
        }
      } catch (error) {
        console.error("Error fetching user data:", error); // Debug log
      }
    };

    fetchProfile();
  }, [user.id]); // Add user.id as dependency

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user.id) {
        console.error("No user ID found in user context");
        return;
      }
      const userDocRef = doc(firebase, "users", user.id); // Use user ID from Firebase

      // Update user document in Firebase
      const updatedProfile = { ...profile };
      if (!profile.password) {
        delete updatedProfile.password; // Don't save the password field if it's empty
      }

      console.log("Updating profile for user ID:", user.id); // Debug log
      console.log("Updated profile data:", updatedProfile); // Debug log

      await updateDoc(userDocRef, updatedProfile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error); // Debug log
      alert("Failed to update profile. Please try again.");
    }
  };

  const districts = [
    "North District",
    "Central District",
    "South District",
    "Jerusalem District",
    "Eilat District",
  ]; // Replace with actual district names

  return (
    <div className="settings-page">
      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-column">
          <div className="form-control">
            <label htmlFor="fullName">Full Name:</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={profile.fullName}
              placeholder="Enter full name"
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label htmlFor="email">Email Address:</label>
            <input
              id="email"
              type="email"
              name="email"
              value={profile.email}
              placeholder="Enter email address"
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label htmlFor="phone">Phone Number:</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={profile.phone}
              placeholder="Enter phone number"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="settings-column">
          <div className="form-control">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              name="password"
              value={profile.password}
              placeholder="Enter new password"
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label htmlFor="district">District:</label>
            <select
              id="district"
              name="district"
              value={profile.district}
              onChange={handleChange}
            >
              <option value="">Select a district</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control checkbox-control">
            <label htmlFor="subscribe">
              <input
                id="subscribe"
                type="checkbox"
                name="subscribe"
                checked={profile.subscribe}
                onChange={handleChange}
              />
              Want to receive updates by SMS
            </label>
          </div>
        </div>
        <button type="submit" className="save-button">
          Save
        </button>
      </form>
    </div>
  );
}

export default Settings;
