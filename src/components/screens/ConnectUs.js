import React from "react";
import "../screensCSS/ConnectUs.css";

class ConnectUs extends React.Component {
  // State to handle form input data
  state = {
    fullName: "",
    email: "",
    subject: "",
    message: "",
  };

  // Handler for form input changes
  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  // Handler for form submission
  handleFormSubmit = (event) => {
    event.preventDefault();
    // Code to handle form submission, like sending an email
  };

  render() {
    return (
      <div className="connectUs">
        <h1>Contact Us</h1>
        <div className="contact-container">
          <form onSubmit={this.handleFormSubmit} className="contact-form">
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
          </form>
          <aside className="contact-info">
            {/* List of contact methods */}
            <ul>
              <li>Phone: XXX-XXX-XXXX</li>
              <li>Fax: XXX-XXX-XXXX</li>
              <li>Email: example@example.com</li>
              <li>Address: 123 Example St, City</li>
            </ul>
          </aside>
        </div>
      </div>
    );
  }
}

export default ConnectUs;
