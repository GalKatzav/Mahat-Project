// import React, { Component } from "react";
// import { database, auth } from "../../services/firebase/FireStore"; // אני מניח שזה הנתיב לקובץ הקונפיגורציה שלך
// import { ref, onValue } from "../../services/firebase/database";

// export default class Messages extends Component {
//   state = {
//     messages: [],
//     loading: true,
//   };

//   componentDidMount() {
//     this.checkAuthState();
//   }

//   checkAuthState = () => {
//     auth.onAuthStateChanged((user) => {
//       if (user) {
//         this.fetchMessages(user.uid);
//       } else {
//         console.log("User is not signed in.");
//         // Handle not signed in, like redirect to login page
//       }
//     });
//   };

//   fetchMessages = (userId) => {
//     const messagesRef = ref(database, messages / $, { userId });
//     onValue(
//       messagesRef,
//       (snapshot) => {
//         const messages = snapshot.val();
//         const messagesList = messages
//           ? Object.keys(messages).map((key) => ({
//               ...messages[key],
//               id: key,
//             }))
//           : [];
//         this.setState({ messages: messagesList, loading: false });
//       },
//       {
//         onlyOnce: true, // If you want to listen to updates continuously remove this line
//       }
//     );
//   };

//   render() {
//     const { messages, loading } = this.state;
//     return (
//       <div id="messagesContainer">
//         {loading ? (
//           <p>Loading messages...</p>
//         ) : messages.length > 0 ? (
//           messages.map((message) => (
//             <div key={message.id} className="message">
//               {message.text}{" "}
//               {/* Replace .text with your actual message field */}
//             </div>
//           ))
//         ) : (
//           <p>No messages found</p>
//         )}
//       </div>
//     );
//   }
// }
