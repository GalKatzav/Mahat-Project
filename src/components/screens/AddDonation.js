import React, { useState } from "react";
import "../screensCSS/AddDonation.css"; // Make sure the path is correct

function AddDonation() {
  const [donation, setDonation] = useState({
    title: "",
    description: "",
    district: "",
    category: "",
    productStatus: "",
    imagePreview: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonation((prevDonation) => ({
      ...prevDonation,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement what happens when the form is submitted
    console.log(donation);
  };

  return (
    <div className="donation-page">
      <div className="donation-container">
        <h2>Create a new donation</h2>
        <form onSubmit={handleSubmit} className="donation-form">
          <div className="input-group">
            <input
              type="text"
              name="title"
              value={donation.title}
              onChange={handleChange}
              placeholder="Item name"
              className="input-field"
            />
          </div>
          <div className="input-group">
            <select
              name="category"
              value={donation.category}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select a category</option>
              {/* Insert your category options here */}
              <option value="moving">moving</option>
              <option value="food">food</option>
              <option value="financial Contribution">
                financial Contribution
              </option>
              <option value="Equipment">Equipment</option>
              <option value="Trump">Trump</option>

              {/* Add more options as needed */}
            </select>
          </div>
          <div className="productStatus">
            <select
              name="productStatus"
              value={donation.productStatus}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select the product status</option>
              {/* Insert your type options here */}
              <option value="new">New</option>
              <option value="used">Used</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="district">
            <select
              name="district"
              value={donation.district}
              onChange={handleChange}
              className="district"
            >
              <option value="">Choose a District</option>
              {/* Insert your type options here */}
              <option value="North district">North district</option>
              <option value="Sout district">Sout district</option>
              <option value="Center district">Center district</option>
              <option value="jerusalem district">jerusalem district</option>
              <option value="Sharon district">Sharon district</option>
              {/* Add more options as needed */}
            </select>
          </div>
          <div className="input-group">
            <textarea
              name="description"
              value={donation.description}
              onChange={handleChange}
              placeholder="Description"
              className="input-field"
            />
          </div>
          <div className="input-group image-upload-group">
            <label htmlFor="image-upload" className="image-upload-label">
              {donation.imagePreview ? (
                <img
                  src={donation.imagePreview}
                  alt="Preview"
                  className="image-preview"
                />
              ) : (
                <div className="image-upload-placeholder">
                  <div className="image-upload-icon">+</div>
                  <div className="image-upload-instructions">Upload Image</div>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                name="image"
                onChange={handleImageChange}
                className="image-upload-input"
              />
            </label>
          </div>
          <button type="submit" className="save-button">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDonation;
