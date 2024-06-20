import React, { useState, useEffect } from "react";
import "../screensCSS/AboutMe.css"; // Ensure this is the correct path to your CSS file
import {
  getFirestore,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useUser } from "../../services/contexts/UserContext"; // נתיב נכון לקונטקסט
import { RxSwitch } from "react-icons/rx"; // יבוא של האייקון

const AboutMe = () => {
  const { user: currentUser } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [newAboutText, setNewAboutText] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const db = getFirestore();
    const aboutMeRef = doc(db, "aboutMe", "aboutText");
    const userRef = doc(db, "users", currentUser.id);

    const fetchInitialData = async () => {
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.userName === "Admin" && userData.fullName === "Admin") {
          setIsAdmin(true);
        }
      }

      const aboutMeSnap = await getDoc(aboutMeRef);
      if (aboutMeSnap.exists()) {
        setAboutText(aboutMeSnap.data().text);
      } else {
        console.log("No such document!");
      }
    };

    fetchInitialData();

    const unsubscribeAboutMe = onSnapshot(aboutMeRef, (docSnap) => {
      if (docSnap.exists()) {
        setAboutText(docSnap.data().text);
      } else {
        console.log("No such document!");
      }
    });

    // Cleanup the listener on component unmount
    return () => unsubscribeAboutMe();
  }, [currentUser]);

  const handleEditClick = () => {
    setNewAboutText(aboutText);
    setEditing(true);
  };

  const handleSaveClick = async () => {
    const db = getFirestore();
    const aboutMeRef = doc(db, "aboutMe", "aboutText");
    await setDoc(aboutMeRef, { text: newAboutText });
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

// Barak123!
