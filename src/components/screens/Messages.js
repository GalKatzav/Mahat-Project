import React, { useEffect, useState } from "react";
import { firebase } from "../../services/firebase/FireStore";
import {
  getDocs,
  updateDoc,
  doc,
  onSnapshot,
  getFirestore,
  query,
  collection,
  where,
  addDoc,
} from "firebase/firestore";
import "../screensCSS/Messages.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../services/contexts/AuthContext";

const fetchMessages = async (user, setMessages, setUnreadCount) => {
  if (!user || !user.uid) {
    console.log("No currentUser or localCurrentUser.uid, returning");
    return;
  }

  console.log("Fetching messages for user:", user);

  // Fetch messages from local storage
  const localMessages = JSON.parse(localStorage.getItem("messages"));
  if (localMessages) {
    console.log("Local messages found:", localMessages);
    setMessages(localMessages);
    setUnreadCount(localMessages.filter((message) => !message.read).length);
  }

  const q = query(
    collection(firebase, "messages"),
    where("receiverId", "==", user.uid)
  );
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const userMessages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log("Fetched messages from Firestore:", userMessages);
    setMessages(userMessages);
    setUnreadCount(userMessages.filter((message) => !message.read).length);

    // Update local storage
    localStorage.setItem("messages", JSON.stringify(userMessages));
  });

  // Cleanup listener on unmount
  return () => unsubscribe();
};

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showSendMessageForm, setShowSendMessageForm] = useState(false);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const { currentUser } = useAuth();
  const [localCurrentUser, setLocalCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setLocalCurrentUser(storedUser);
    }
    setLoadingUser(false);
  }, []);

  useEffect(() => {
    if (loadingUser) return;
    console.log("useEffect called with currentUser:", currentUser);

    const checkAdmin = async () => {
      const user = currentUser || localCurrentUser;
      if (!user) {
        console.log("No currentUser or localCurrentUser, returning mes");
        return;
      }
      console.log("Checking admin status for user:", user);

      const db = getFirestore();
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("userName", "==", "admin"),
        where("fullName", "==", "admin")
      );

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const adminDoc = querySnapshot.docs[0];
          console.log("Admin document ID:", adminDoc.id);

          // Check if the current user's document ID matches the admin document ID
          if (adminDoc.id === user.uid) {
            console.log("Admin user found!");
            setIsAdmin(true);
          } else {
            console.log("Current user is not admin.");
          }
        } else {
          console.log("Admin user not found.");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    };

    if (currentUser || localCurrentUser) {
      checkAdmin();
    }
  }, [currentUser, localCurrentUser, loadingUser]);

  useEffect(() => {
    if (loadingUser || isUserLoaded) return;

    const user = currentUser || localCurrentUser;

    if (user) {
      fetchMessages(user, setMessages, setUnreadCount);
      setIsUserLoaded(true);
    }
  }, [currentUser, localCurrentUser, loadingUser, isUserLoaded]);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(firebase, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    // Check if currentUser is defined in localStorage
    if (currentUser || localCurrentUser) {
      fetchUsers();
    }
  }, [currentUser, localCurrentUser, loadingUser]);

  const markAsRead = async (messageId) => {
    const messageDoc = doc(firebase, "messages", messageId);
    await updateDoc(messageDoc, { read: true });

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );

    // Recalculate unread count
    setUnreadCount(
      messages.filter((message) => !message.read && message.id !== messageId)
        .length
    );
  };

  const markAsUnread = async (messageId) => {
    const messageDoc = doc(firebase, "messages", messageId);
    await updateDoc(messageDoc, { read: false });

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, read: false } : msg
      )
    );

    // Recalculate unread count
    setUnreadCount(
      messages.filter((message) => !message.read || message.id === messageId)
        .length
    );
  };

  const toggleModal = (message) => {
    if (message && !message.read) {
      markAsRead(message.id);
    }
    setSelectedMessage(selectedMessage ? null : message);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMessage((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const receiver = users.find((u) => u.id === newMessage.to);
    if (!receiver) {
      toast.error("User not found!");
      return;
    }
    const user = currentUser || localCurrentUser;
    console.log(`currentUser: ${user}`);
    console.log(`currentUser.uid: ${user.uid}`);

    if (!user || !user.uid) {
      toast.error("Current user not authenticated!");
      return;
    }
    try {
      await addDoc(collection(firebase, "messages"), {
        subject: newMessage.subject,
        message: newMessage.message,
        receiverId: newMessage.to,
        senderId: user.uid,
        read: false,
        id: Date.now(),
      });
      toast.success("Message sent successfully!");
      setShowSendMessageForm(false);
      setNewMessage({
        to: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message.");
    }
  };

  return (
    <div className="messages-container">
      <ToastContainer />
      <div className="messages-header">
        <h1>Messages</h1>
        {unreadCount > 0 && (
          <div className="unread-count">
            <span>{unreadCount}</span>
          </div>
        )}
        {isAdmin && (
          <button
            className="btn btn-send-message"
            onClick={() => setShowSendMessageForm(true)}
          >
            Send Message
          </button>
        )}
      </div>
      <div className="messages-list-wrapper">
        <ul className="messages-list">
          {messages.map((message) => (
            <li
              key={message.id}
              className={`message-item ${message.read ? "read" : "unread"}`}
              onClick={() => toggleModal(message)}
            >
              <h3>{message.subject}</h3>
              <p>
                {message.message.length > 50
                  ? `${message.message.slice(0, 50)}...`
                  : message.message}
              </p>
              <button
                className="btn btn-unread"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the modal
                  markAsUnread(message.id);
                }}
              >
                Mark as Unread
              </button>
              <button
                className="btn btn-view"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the modal
                  toggleModal(message);
                }}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selectedMessage && (
        <div className="modal-overlay" onClick={() => toggleModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMessage.subject}</h2>
            <p>{selectedMessage.message}</p>
            <button className="btn btn-close" onClick={() => toggleModal(null)}>
              Close
            </button>
          </div>
        </div>
      )}
      {showSendMessageForm && (
        <div
          className="form-overlay"
          onClick={() => setShowSendMessageForm(false)}
        >
          <div className="form-container" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSendMessage}>
              <h2>Send Message</h2>
              <label htmlFor="to">To:</label>
              <select
                name="to"
                value={newMessage.to}
                onChange={handleInputChange}
                required
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.userName}
                  </option>
                ))}
              </select>
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                name="subject"
                value={newMessage.subject}
                onChange={handleInputChange}
                required
              />
              <label htmlFor="message">Message:</label>
              <textarea
                name="message"
                value={newMessage.message}
                onChange={handleInputChange}
                required
              ></textarea>
              <button type="submit">Send</button>
              <button
                type="button"
                onClick={() => setShowSendMessageForm(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export { Messages as default, fetchMessages };
