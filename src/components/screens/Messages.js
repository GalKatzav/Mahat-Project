import React, { useEffect, useState } from "react";
import { firebase } from "../../services/firebase/FireStore";
import { updateDoc, doc } from "firebase/firestore";
import "../screensCSS/Messages.css";
import { useUser } from "../../services/contexts/UserContext";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchMessages = () => {
      try {
        const storedMessages = localStorage.getItem("messages");
        if (storedMessages) {
          const userMessages = JSON.parse(storedMessages).filter(
            (message) => message.receiverId === user.id
          );
          setMessages(userMessages);
          setUnreadCount(
            userMessages.filter((message) => !message.read).length
          );
        }
      } catch (error) {
        console.error("Error fetching messages from local storage:", error);
      }
    };

    if (user) {
      fetchMessages();
    }
  }, [user]);

  const markAsRead = async (messageId) => {
    const messageDoc = doc(firebase, "messages", messageId);
    await updateDoc(messageDoc, { read: true });

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );
    setUnreadCount((prevCount) => prevCount - 1);

    // Update local storage
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
  };

  const markAsUnread = async (messageId) => {
    const messageDoc = doc(firebase, "messages", messageId);
    await updateDoc(messageDoc, { read: false });

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === messageId ? { ...msg, read: false } : msg
      )
    );
    setUnreadCount((prevCount) => prevCount + 1);

    // Update local storage
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, read: false } : msg
    );
    localStorage.setItem("messages", JSON.stringify(updatedMessages));
  };

  const toggleModal = (message) => {
    if (message && !message.read) {
      markAsRead(message.id);
    }
    setSelectedMessage(selectedMessage ? null : message);
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Messages</h1>
        {unreadCount > 0 && (
          <div className="unread-count">
            <span>{unreadCount}</span>
          </div>
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
            <button
              className="btn btn-close"
              onClick={() => toggleModal(null)}
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;
