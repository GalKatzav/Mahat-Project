import React from "react";
import "../screensCSS/ConnectUs.css";
import { firebase } from "../../services/firebase/FireStore";
import { addDoc, collection } from "firebase/firestore";

class ConnectUs extends React.Component {
  state = {
    fullName: "",
    email: "",
    subject: "",
    message: "",
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const db = firebase;
      const inquiriesCollection = collection(db, "inquiries");
      await addDoc(inquiriesCollection, {
        inquiriesId: Date.now(), // Unique ID using Date.now()
        fullName: this.state.fullName,
        email: this.state.email,
        subject: this.state.subject,
        message: this.state.message,
      });
      alert("Message sent successfully!");
      this.setState({
        fullName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message: ", error);
      alert("Failed to send message. Please try again.");
    }
  };

  render() {
    return (
      <div className="connectUs">
        <h1>Contact Us</h1>
        <div className="contact-container">
          <form onSubmit={this.handleFormSubmit} className="contact-form">
            <div className="left-column">
              <label>
                Full Name:
                <input
                  type="text"
                  name="fullName"
                  value={this.state.fullName}
                  onChange={this.handleInputChange}
                  placeholder="John Doe"
                />
              </label>
              <label>
                Email Address:
                <input
                  type="email"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                  placeholder="john.doe@example.com"
                />
              </label>
            </div>
            <div className="right-column">
              <label>
                Subject:
                <input
                  type="text"
                  name="subject"
                  value={this.state.subject}
                  onChange={this.handleInputChange}
                  placeholder="Inquiry about donations"
                />
              </label>
              <label>
                Message:
                <textarea
                  name="message"
                  value={this.state.message}
                  onChange={this.handleInputChange}
                  placeholder="Please enter your message here"
                />
              </label>
              <button type="submit">Send</button>
            </div>
          </form>
          <aside className="contact-info"></aside>
        </div>
        <div className="footer-space"></div>{" "}
        {/* Add this div to create space between the container and the footer */}
      </div>
    );
  }
}

export default ConnectUs;
