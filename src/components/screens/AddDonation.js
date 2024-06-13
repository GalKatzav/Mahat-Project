import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../services/contexts/UserContext";
import "../screensCSS/AddDonation.css";
import { storage } from "../../services/firebase/FireStore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { firebase } from "../../services/firebase/FireStore";

function AddDonation() {
  const [donation, setDonation] = useState({
    donationName: "",
    description: "",
    district: "",
    category: "",
    productStatus: "",
    imagePreview: null,
    imageFile: null,
  });

  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/Log_In");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonation((prevDonation) => ({
      ...prevDonation,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setDonation((prevDonation) => ({
          ...prevDonation,
          imagePreview: e.target.result,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      if (donation.imageFile) {
        const imageRef = ref(
          storage,
          `donations/${Date.now()}_${donation.imageFile.name}`
        );
        await uploadBytes(imageRef, donation.imageFile);
        imageUrl = await getDownloadURL(imageRef);
      } else {
        imageUrl = "default_image_url"; // Replace with your default image URL
      }
      const newDonation = {
        category: donation.category,
        description: donation.description,
        district: donation.district,
        donationId: Date.now(),
        donationName: donation.donationName,
        productStatus: donation.productStatus,
        userId: user.id,
        imageUrl,
        createdAt: Date.now(),
      };
      delete newDonation.imagePreview;
      delete newDonation.imageFile;
      await addDoc(collection(firebase, "donations"), newDonation);
      alert("Donation created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating donation: ", error);
      alert("Failed to create donation. Please try again.");
    }
  };

  return (
    <div className="donation-page">
      <div className="donation-container">
        <h2>Create a New Donation</h2>
        <form onSubmit={handleSubmit} className="donation-form">
          <div className="left-column">
            <select
              name="category"
              value={donation.category}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Select a category</option>
              <option value="Service">Service</option>
              <option value="Food">Food</option>
              <option value="Item">Item</option>
              <option value="Money">Money</option>
            </select>
            <input
              type="text"
              name="donationName"
              value={donation.donationName}
              onChange={handleChange}
              placeholder="Item name"
              required
              className="input-field"
            />
            {donation.category === "Item" && (
              <select
                name="productStatus"
                value={donation.productStatus}
                onChange={handleChange}
                required
                className="select-field"
              >
                <option value="">Select the product status</option>
                <option value="used">Used</option>
                <option value="not used">Not Used</option>
              </select>
            )}
            <select
              name="district"
              value={donation.district}
              onChange={handleChange}
              required
              className="select-field"
            >
              <option value="">Choose a District</option>
              <option value="Center District">Center District</option>
              <option value="North District">North District</option>
              <option value="South District">South District</option>
              <option value="Jerusalem District">Jerusalem District</option>
              <option value="Eilat District">Eilat District</option>
            </select>
          </div>
          <div className="right-column">
            <textarea
              name="description"
              value={donation.description}
              onChange={handleChange}
              placeholder="Description"
              required
              className="textarea-field"
            />
            <label htmlFor="image-upload" className="image-upload-label">
              <div className="upload-icon">+</div>
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
          </div>
          <button type="submit" className="save-button">
            SAVE
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDonation;
