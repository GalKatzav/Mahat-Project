import React from "react";
import { Link } from "react-router-dom";
import "../screensCSS/HomePage.css"; // Make sure the CSS file path is correct

const HomePage = () => {
  return (
    <div className="HomePage">
      <div className="main-content">
        <h4>EMPOWER CHANGE, DONATE TODAY: TOGETHER WE WILL WIN!</h4>
        <div className="content-container">
          <div className="stat">
            <p>450,000</p>
            <p>Families receiving service</p>
          </div>
          <div className="call-to-action">
            <Link to="/Log_In">
              <button>For immediate donations, please click here.</button>
            </Link>
          </div>
          <div className="stat">
            <p>160,000</p>
            <p>Donations collected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
