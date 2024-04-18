/*
import React from "react";
import "../screensCSS/AboutMe.css"; // Your CSS file for styling

const AboutMe = () => {
  return (
    <div className="about-me-container">
      <div className="about-me-content">
        <h1>About Me</h1>
        <p>Hi, I'm glad you're here.</p>
        <p>
          I'm part of a team that volunteers at a local community center. Every
          week we gather and organize food packages for over 160,000 families
          who do not have enough income to afford it. The happiness in the
          children's eyes when they receive the packages gives us the motivation
          to continue and expand the volunteering circles.
        </p>
        <p>
          The volunteering team includes high school students, soldiers, and
          other good-hearted people. We sort and pack the products, which
          include fruits, vegetables, dry goods, and dairy, and distribute the
          packages to the families, elderly, and anyone else in need.
        </p>
        <p>
          Thanks to our volunteers' dedication, we manage to bring a smile to
          the faces of thousands each week.
        </p>
        <p>
          For full details and to join our volunteering team, contact us at 123
          Main Street.
        </p>
        {/* Image placeholders 
        
        <div className="about-me-images">
          <img src="/path-to-your-image.jpg" alt="Volunteering" />
          <img src="/path-to-your-second-image.jpg" alt="Food Distribution" />
        </div>
      </div>
    </div>
  );
};

export default AboutMe;

*/

import React from "react";
import "../screensCSS/AboutMe.css"; // Ensure this is the correct path to your CSS file

const AboutMe = () => {
  return (
    <div className="about-me-container">
      {/* Right-aligned content wrapper */}
      <div className="about-me-content">
        {/* Content */}
        <h2>About Me</h2>
        <p>Hi, I'm glad you're here.</p>
        <p>
          I'm part of a team that volunteers at a local community center. Every
          week we gather and organize food packages for over 160,000 families
          who do not have enough income to afford it. The happiness in the
          children's eyes when they receive the packages gives us the motivation
          to continue and expand the volunteering circles.
        </p>
        <p>
          The volunteering team includes high school students, soldiers, and
          other good-hearted people. We sort and pack the products, which
          include fruits, vegetables, dry goods, and dairy, and distribute the
          packages to the families, elderly, and anyone else in need.
        </p>
        <p>
          Thanks to our volunteers' dedication, we manage to bring a smile to
          the faces of thousands each week.
        </p>
        <p>
          For full details and to join our volunteering team, contact us at 123
          Main Street.
        </p>
      </div>
    </div>
  );
};

export default AboutMe;
