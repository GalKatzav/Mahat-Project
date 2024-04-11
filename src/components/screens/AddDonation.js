import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import { useUser } from "../../services/contexts/UserContext"; // Adjust this path based on your project structure
import "../screensCSS/AddDonation.css"; // Ensure the correct path to your CSS file

function AddDonation() {
  // State for the donation form inputs
  const [donation, setDonation] = useState({
    title: "",
    description: "",
    district: "",
    category: "",
    productStatus: "",
    imagePreview: null,
  });

  const { user } = useUser(); // Accessing the current user from context
  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the login page if no user is logged in
  useEffect(() => {
    if (!user) {
      navigate("/Log_In");
    }
  }, [user, navigate]);

  // Handle changes in form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonation((prevDonation) => ({
      ...prevDonation,
      [name]: value,
    }));
  };

  // Handle image file selection and preview
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDonation((prevDonation) => ({
          ...prevDonation,
          imagePreview: e.target.result,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(donation);
    // Here you would typically handle the submission, like sending the data to your backend or Firebase
  };

  return (
    <div className="donation-page">
      <div className="donation-container">
        <h2>Create a New Donation</h2>
        <form onSubmit={handleSubmit} className="donation-form">
          <input
            type="text"
            name="title"
            value={donation.title}
            onChange={handleChange}
            placeholder="Item name"
            required
          />
          <select
            name="category"
            value={donation.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {/* Add more categories as needed */}
          </select>
          <select
            name="productStatus"
            value={donation.productStatus}
            onChange={handleChange}
            required
          >
            <option value="">Select the product status</option>
            {/* Add more options as needed */}
          </select>
          <select
            name="district"
            value={donation.district}
            onChange={handleChange}
            required
          >
            <option value="">Choose a District</option>
            {/* Add more districts as needed */}
          </select>
          <textarea
            name="description"
            value={donation.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <label htmlFor="image-upload" className="image-upload-label">
            Upload Image
            <input
              id="image-upload"
              type="file"
              name="image"
              onChange={handleImageChange}
              hidden
            />
          </label>
          {donation.imagePreview && (
            <img
              src={donation.imagePreview}
              alt="Preview"
              className="image-preview"
            />
          )}
          <button type="submit" className="save-button">
            Save Donation
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDonation;
