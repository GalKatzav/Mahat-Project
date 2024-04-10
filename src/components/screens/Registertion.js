import React, { useEffect, useState } from "react";
import "../screensCSS/Registertion.css";
import { firebase } from "../../services/firebase/FireStore";
import { getDocs, collection, addDoc } from "firebase/firestore";

const Registration = () => {
  const [countUsers, setCountUsers] = useState(800100);
  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    password: "",
    email: "",
    district: "",
    phone: "",
  });

  const [users, setUsers] = useState([]);
  const usersCollectionReference = collection(firebase, "users");

  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await getDocs(usersCollectionReference);
        setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        // Assuming you're storing countUsers as a number in the document, find the max
        const maxId = data.docs.reduce(
          (max, doc) => Math.max(max, doc.data().id || 0),
          countUsers
        );
        setCountUsers(maxId + 1);
      } catch (e) {
        console.error("Cannot retrieve data from Firebase:", e);
      }
    };
    getUsers();
  }, []);

  const createUser = async () => {
    try {
      const newUserId = countUsers;
      const newUser = { ...form, id: newUserId };
      const docRef = await addDoc(usersCollectionReference, newUser);
      console.log("New user created with ID:", docRef.id);
      // Increment countUsers for the next user
      setCountUsers(newUserId + 1);

      // Reset the form state here if desired
      setForm({
        fullName: "",
        userName: "",
        password: "",
        email: "",
        district: "",
        phone: "",
      });
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createUser();
  };

  return (
    <div className="Registration">
      <div className="registration-container">
        <form className="registration-form" onSubmit={handleSubmit}>
          <h2>Create New User</h2>
          {/* Form fields */}
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
              name="district"
              value={form.district}
              onChange={handleChange}
              placeholder="Geographic district"
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
          {/* Submit button */}
          <button type="submit" className="save-button">
            ADD NEW USER
          </button>
        </form>
      </div>
    </div>
  );
};

export default Registration;
