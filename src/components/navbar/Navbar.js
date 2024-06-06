import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../services/contexts/UserContext";
import { firebase } from "../../services/firebase/FireStore";
import { collection, getDocs } from "firebase/firestore";
import "./Navbar.css";
import icon from "../../images/icon.jpg";

export default function Navbar() {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const messagesCollectionReference = collection(firebase, "messages");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const querySnapshot = await getDocs(messagesCollectionReference);
        const userMessages = querySnapshot.docs
          .map((doc) => doc.data())
          .filter(
            (message) => message.receiverId === user?.id && !message.read
          );

        setUnreadCount(userMessages.length);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (user) {
      fetchUnreadMessages();
    }
  }, [messagesCollectionReference, user]);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    console.log("Menu state after click:", !isMenuOpen);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo-and-time">
          <Link to="/">
            <img
              src={icon}
              alt="logoProject"
              style={{ width: "100px", height: "auto" }}
            />
          </Link>
          <span className="current-time">{currentTime}</span>
        </div>
        <div className="navbar-main-links">
          <Link to="/" className="nav-link">
            Home Page
          </Link>
          <Link to="/Messages" className="nav-link">
            Messages{" "}
            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
          </Link>
          <Link to="/About_Me" className="nav-link">
            About Me
          </Link>
          {user ? (
            <button onClick={handleLogout} className="nav-link logout-button">
              Logout
            </button>
          ) : (
            <Link to="/Log_In" className="nav-link">
              Login / Registration
            </Link>
          )}
        </div>
        <div className="hamburger" onClick={handleToggleMenu}>
          ☰
        </div>
        {isMenuOpen && (
          <ul className="nav-menu-hamburger">
            <li>
              <Link to="/" className="nav-link-hamburger">
                Home Page
              </Link>
            </li>
            <li>
              <Link to="/Add_Donation" className="nav-link-hamburger">
                Add Donation
              </Link>
            </li>
            <li>
              <Link to="/Donations_Search" className="nav-link-hamburger">
                Donations Search
              </Link>
            </li>
            <li>
              <Link to="/Settings" className="nav-link-hamburger">
                Settings
              </Link>
            </li>
            <li>
              <Link to="/Connect_Us" className="nav-link-hamburger">
                Connect Us
              </Link>
            </li>
            <li>
              <Link to="/Messages" className="nav-link-hamburger">
                Messages{" "}
                {unreadCount > 0 && (
                  <span className="badge">{unreadCount}</span>
                )}
              </Link>
            </li>
            <li>
              <Link to="/About_Me" className="nav-link-hamburger">
                About Me
              </Link>
            </li>
            {user ? (
              <li>
                <Link
                  to="/"
                  className="nav-link-hamburger"
                  onClick={handleLogout}
                >
                  Logout
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/Log_In" className="nav-link-hamburger-in">
                  Login / Registration
                </Link>
              </li>
            )}
          </ul>
        )}
      </nav>
    </div>
  );
}
