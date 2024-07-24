import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../services/contexts/UserContext";
import { useAuth } from "../../services/contexts/AuthContext";
import "../screensCSS/AddDonation.css";
import { storage, firebase } from "../../services/firebase/FireStore"; // ודא שאתה מייבא את firebase
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";

function AddDonation() {
  const [donation, setDonation] = useState({
    title: "",
    description: "",
    district: "",
    category: "",
    productStatus: "",
    imagePreview: null,
    imageFile: null,
    imageName: null,
  });

  const { user } = useUser();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log("User in AddDonation useEffect:", user);
    console.log("Current user from AuthContext:", currentUser);
    if (!user) {
      navigate("/Log_In");
    }
  }, [user, currentUser, navigate]);

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
      console.log("File to upload:", file);
      setDonation((prevDonation) => ({
        ...prevDonation,
        imagePreview: URL.createObjectURL(file),
        imageFile: file,
        imageName: file.name,
      }));
    }
  };

  const handleRemoveImage = () => {
    setDonation((prevDonation) => ({
      ...prevDonation,
      imagePreview: null,
      imageFile: null,
      imageName: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user) {
        console.error("User is not authenticated");
        throw new Error("User is not authenticated");
      }

      console.log("Current user:", currentUser);
      const token = await currentUser.getIdToken(true);
      console.log("User token In handleSubmit:", token);

      const userUID = user.id;

      let imageUrl = "";
      if (donation.imageFile) {
        console.log("File to upload:", donation.imageFile);
        const imageRef = ref(
          storage,
          `image/${userUID}/${Date.now()}_${donation.imageFile.name}`
        );
        console.log("Uploading to:", imageRef.fullPath);
        await uploadBytes(imageRef, donation.imageFile);
        imageUrl = await getDownloadURL(imageRef);
        console.log("Image uploaded to:", imageUrl);
      } else {
        imageUrl = "default_image_url"; // Replace with your default image URL
      }

      const newDonation = {
        IdDonations: Date.now(),
        category: donation.category,
        description: donation.description,
        district: donation.district,
        idUser: userUID,
        image: imageUrl,
        productStatus: donation.productStatus,
        title: donation.title,
      };

      await addDoc(collection(firebase, "DataDonations"), newDonation);
      alert("Donation created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating donation: ", error.message, error.stack);
      alert(
        `Failed to create donation. Please try again. Error: ${error.message}`
      );
    }
  };

  return (
    <div className="donation-page">
      <div className="donation-container">
        <h2>Create a New Donation</h2>
        <form onSubmit={handleSubmit} className="donation-form">
          <div className="columns-container">
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
                name="title"
                value={donation.title}
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
            </div>
          </div>
          <div className="image-upload-wrapper">
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
            {donation.imageName && (
              <div className="file-name">{donation.imageName}</div>
            )}
            {donation.imageName && (
              <button
                type="button"
                className="remove-image"
                onClick={handleRemoveImage}
              >
                Remove Image
              </button>
            )}
          </div>
          <div className="save-button-wrapper">
            <button type="submit" className="save-button">
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDonation;
