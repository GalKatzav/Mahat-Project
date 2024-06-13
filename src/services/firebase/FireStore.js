// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";
// If you need analytics, you can import and initialize it when necessary
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4ntNbv147RWCCGadcK7WpsvhMm7DTaYA",
  authDomain: "donations-database.firebaseapp.com",
  projectId: "donations-database",
  storageBucket: "donations-database.appspot.com",
  messagingSenderId: "986391190828",
  appId: "1:986391190828:web:72a5ec41dae70970e32089",
  measurementId: "G-5PNR6JS9E3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// If you need analytics, you can initialize it here
// const analytics = getAnalytics(app);

export const firebase = getFirestore(app);
export const storage = getStorage(app);
