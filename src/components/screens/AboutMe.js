import React, { useState, useEffect } from "react";
import "../screensCSS/AboutMe.css"; // Ensure this is the correct path to your CSS file
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "../../services/contexts/UserContext"; // נתיב נכון לקונטקסט
import { RxSwitch } from "react-icons/rx"; // יבוא של האייקון

const AboutMe = () => {
  const { user: currentUser } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [newAboutText, setNewAboutText] = useState("");

  useEffect(() => {
    const fetchAboutText = async () => {
      const db = getFirestore();
      const docRef = doc(db, "aboutMe", "aboutText");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setAboutText(docSnap.data().text);
      } else {
        console.log("No such document!");
      }
    };

    fetchAboutText();

    const checkAdmin = async () => {
      if (!currentUser) return;
      const db = getFirestore();
      const usersRef = doc(db, "users", currentUser.id);
      const docSnap = await getDoc(usersRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.userName === "Admin" && userData.fullName === "Admin") {
          setIsAdmin(true);
        }
      }
    };

    checkAdmin();
  }, [currentUser]);

  const handleEditClick = () => {
    setNewAboutText(aboutText);
    setEditing(true);
  };

  const handleSaveClick = async () => {
    const db = getFirestore();
    const docRef = doc(db, "aboutMe", "aboutText");
    await setDoc(docRef, { text: newAboutText });
    setAboutText(newAboutText);
    setEditing(false);
  };

  return (
    <div className="about-me-container">
      <div className="about-me-content">
        <h2>About Me</h2>
        {editing ? (
          <textarea
            className="edit-textarea"
            value={newAboutText}
            onChange={(e) => setNewAboutText(e.target.value)}
          />
        ) : (
          aboutText.split("\n").map((line, index) => <p key={index}>{line}</p>)
        )}
        {isAdmin && (
          <div className="admin-buttons">
            {!editing && (
              <button className="edit-mode-btn" onClick={handleEditClick}>
                <RxSwitch />
              </button>
            )}
            {editing && (
              <button className="save-btn" onClick={handleSaveClick}>
                Save
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutMe;
