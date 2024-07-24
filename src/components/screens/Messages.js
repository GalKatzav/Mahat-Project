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
import { useUser } from "../../services/contexts/UserContext";

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
  const { user: currentUser } = useUser();

  useEffect(() => {
    console.log("useEffect called with currentUser:", currentUser);

    const checkAdmin = async () => {
      if (!currentUser) {
        console.log("No currentUser, returning");
        return;
      }
      console.log("Checking admin status for user:", currentUser);

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
          if (adminDoc.id === currentUser.id) {
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

    if (currentUser) {
      checkAdmin();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentUser || !currentUser.uid) {
        console.log("No currentUser or currentUser.uid, returning");
        return;
      }

      console.log("Fetching messages for currentUser:", currentUser);

      // Fetch messages from local storage
      const localMessages = JSON.parse(localStorage.getItem("messages"));
      if (localMessages) {
        setMessages(localMessages);
        setUnreadCount(localMessages.filter((message) => !message.read).length);
      }

      const q = query(
        collection(firebase, "messages"),
        where("receiverId", "==", currentUser.uid)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const userMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(userMessages);
        setUnreadCount(userMessages.filter((message) => !message.read).length);

        // Update local storage
        localStorage.setItem("messages", JSON.stringify(userMessages));
      });

      // Cleanup listener on unmount
      return () => unsubscribe();
    };

    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(firebase, "users"));
      const usersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersList);
    };

    // Check if currentUser is defined in localStorage
    const localCurrentUser = JSON.parse(localStorage.getItem("user"));
    if (localCurrentUser) {
      fetchMessages();
      fetchUsers();
    }
  }, [currentUser]);

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
    try {
      await addDoc(collection(firebase, "messages"), {
        subject: newMessage.subject,
        message: newMessage.message,
        receiverId: newMessage.to,
        senderId: currentUser.uid,
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

export default Messages;
