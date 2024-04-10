import React, { useState } from "react";

function AddDonation() {
  const [donation, setDonation] = useState({
    title: "",
    description: "",
    amount: "",
    // Include other fields as necessary
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDonation((prevDonation) => ({
      ...prevDonation,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, like sending data to a server
    console.log(donation);
  };

  return (
    <div
      style={{
        background: "url(../../images/createDonPic.jpg)",
        backgroundSize: "cover",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "600px",
          background: "rgba(255, 255, 255, 0.8)",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.7)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#333" }}>יצירת תרומה חדשה</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              name="title"
              value={donation.title}
              onChange={handleChange}
              placeholder="כותרת"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                marginBottom: "10px",
              }}
            />
            <textarea
              name="description"
              value={donation.description}
              onChange={handleChange}
              placeholder="תיאור"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                height: "100px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <input
              type="text"
              name="amount"
              value={donation.amount}
              onChange={handleChange}
              placeholder="סכום התרומה"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#d17485",
              color: "white",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            שמור
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddDonation;
