import React from "react";
import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="copyright">
        &copy; {year} Adi Sasportas && Gal katzav All rights reserved.
      </p>
      <div className="link-container">
        <a
          href="https://www.linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          <img
            src="https://store-images.s-microsoft.com/image/apps.31120.9007199266245564.44dc7699-748d-4c34-ba5e-d04eb48f7960.bc4172bd-63f0-455a-9acd-5457f44e4473?h=253"
            alt="LinkedIn"
            className="icon"
          />
        </a>
        <a
          href="https://github.com/GalKatzav/Mahat-Project.git"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/GitHub_Invertocat_Logo.svg/800px-GitHub_Invertocat_Logo.svg.png"
            alt="GitHub"
            className="icon"
          />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Instagram-Icon.png/600px-Instagram-Icon.png"
            alt="Instagram"
            className="icon"
          />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Facebook_icon.svg/2048px-Facebook_icon.svg.png"
            alt="Facebook"
            className="icon"
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
