import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import icon from "../../images/icon.jpg";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <nav className="navbar">
        <div className="logo">
          <Link to="/" className="nav-link btn btn-outline-secondary">
            <img
              src={icon}
              alt="logoProject"
              style={{ width: "100px", height: "auto" }}
            />
          </Link>
          <span className="current-time">{currentTime}</span>
        </div>
        <ul className="nav-menu">
          <li className="Home_Page_nav-item">
            <a href="/" className="nav-link btn btn-outline-secondary">
              Home Page
            </a>
          </li>
          <li className="About_Me_nav-item">
            <a href="/About_Me" className="nav-link btn btn-outline-secondary">
              About Me
            </a>
          </li>
          <li className="Add_Donation_nav-item">
            <a
              href="/Add_Donation"
              className="nav-link btn btn-outline-secondary"
            >
              Add Donation
            </a>
          </li>
          <li className="Donations_Search_nav-item">
            <a
              href="/Donations_Search"
              className="nav-link btn btn-outline-secondary"
            >
              Donations Search{" "}
            </a>
          </li>
          <li className="ConnectUs-nav-item">
            <a
              href="/Connect_Us"
              className="nav-link btn btn-outline-secondary"
            >
              Connect Us{" "}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}
