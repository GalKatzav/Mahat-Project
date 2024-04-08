import React from "react";
import { Link } from "react-router-dom";
import "../screensCSS/HomePage.css"; // Make sure the CSS file path is correct

const HomePage = () => {
  return (
    <div className="main-content">
      <h1>EMPOWER CHANGE, DONATE TODAY: TOGETHER WE WILL WIN!</h1>
      <div className="content-container">
        <div className="stat">
          <p>450,000</p>
          <p>משפחות מקבלות שירות</p>
        </div>
        <div className="call-to-action">
          <Link to="/Log_In">
            <button>לתרומה מהירה לחץ כאן</button>
          </Link>
        </div>
        <div className="stat">
          <p>160,000</p>
          <p>תרומות שנאספו</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
