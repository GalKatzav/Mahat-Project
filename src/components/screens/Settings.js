import React, { useState } from "react";
import "../screensCSS/Settings.css"; // Update with your actual path to the CSS file

function Settings() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    district: "",
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
    // Insert form submission logic here
    console.log("Profile data submitted:", profile);
  };

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
              onChange={handleChange}
            />
          </div>
          <div className="form-control">
            <label htmlFor="district">District:</label>
            <input
              id="district"
              type="text"
              name="district"
              value={profile.district}
              onChange={handleChange}
            />
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
        <button type="submit" className="save-button">Save</button>
      </form>
    </div>
  );
}

export default Settings;
