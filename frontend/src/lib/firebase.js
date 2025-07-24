// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBS3Vy0x-69-950cP6pDzmIo0SodHIAKZM",
  authDomain: "dongengku-54913.firebaseapp.com",
  projectId: "dongengku-54913",
  storageBucket: "dongengku-54913.firebasestorage.app",
  messagingSenderId: "579055263368",
  appId: "1:579055263368:web:d6bf18cf7552363cc7493d",
  measurementId: "G-NTVJ1YJ65Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);