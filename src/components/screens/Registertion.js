import React, { useEffect, useState } from "react";
import "../screensCSS/Registertion.css";
import { firebase } from "../../services/firebase/FireStore";
import { getDocs, collection, addDoc } from "firebase/firestore"; // Ensure these imports match your Firebase version

const Registertion = () => {
  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    password: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle the registration logic here
    console.log(form);
  };

  return (
    <div className="registration-container">
      {/* <img src={backroundReg} alt="backroundReg"></img> */}
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Create New User</h2>
        <div className="input-group">
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Geographic Address"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            placeholder="User Name"
            required
          />
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>
        <button type="submit" className="save-button">
          SAVE
        </button>
      </form>
    </div>
  );
};

export default Registertion;
