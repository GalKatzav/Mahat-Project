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
        <p>Hi, We are glad you're here.</p>
        <p>
          We are a non-profit organization working to break the cycle of poverty
          in Israrl. The organization helps about 160,000 families every year
          regardless of religion, race, origin or nationally. The organization
          maintains direct contact with the recipoents of the aid, which allows
          solutions to be adapted to immediate and unique needs that arise from
          the field.
        </p>
        <p>
          Our vision is to break the cycle of intergenerational poverty in
          Israel in order to realize our vision, we help thousands of needy
          families, who are sent to us with referral letters from social
          workers, all over the country. And we distribute thousands of food
          baskets to families and babies, clothing, furniture, legal and medical
          assistance and more.
        </p>
        <p>our address 123 Chazon Ish St. Tel Aviv</p>
        <h3>Together we will win 🙏💕</h3>
      </div>
    </div>
  );
};

export default AboutMe;
