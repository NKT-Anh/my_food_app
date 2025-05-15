// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBThSs7pgdW_3UyyLsBYly3_ysl3yM1UP8",
  authDomain: "foodapp-a1612.firebaseapp.com",
  projectId: "foodapp-a1612",
  storageBucket: "foodapp-a1612.firebasestorage.app",
  messagingSenderId: "868339075485",
  appId: "1:868339075485:web:d7d3bd25277d1294b80774",
  measurementId: "G-54MNBHRLF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };