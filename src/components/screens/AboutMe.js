import React, { useState, useEffect } from "react";
import "../screensCSS/AboutMe.css"; // Ensure this is the correct path to your CSS file
import {
  getFirestore,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useUser } from "../../services/contexts/UserContext"; // Correct path to the context
import { RxSwitch } from "react-icons/rx"; // Import the icon

const AboutMe = () => {
  const { user: currentUser } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [aboutText, setAboutText] = useState("");
  const [newAboutText, setNewAboutText] = useState("");

  useEffect(() => {
    if (!currentUser) {
      console.error("Current user is not defined");
      return;
    }

    console.log("Current User:", currentUser); // Debug log

    const db = getFirestore();
    const aboutMeRef = doc(db, "aboutMe", "aboutText"); // Correct path
    const userRef = doc(db, "users", currentUser.id || currentUser.uid); // Check for both id and uid

    console.log("About Me Ref:", aboutMeRef); // Debug log
    console.log("User Ref:", userRef); // Debug log

    const fetchInitialData = async () => {
      try {
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          console.log("User Data:", userData); // Debug log
          if (userData.userName === "admin" && userData.fullName === "admin") {
            setIsAdmin(true);
          }
        } else {
          console.log("No such user document!");
        }

        const aboutMeSnap = await getDoc(aboutMeRef);
        if (aboutMeSnap.exists()) {
          setAboutText(aboutMeSnap.data().text);
        } else {
          console.log("No such aboutMe document!");
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
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
    const aboutMeRef = doc(db, "aboutMe", "aboutText"); // Correct path
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
