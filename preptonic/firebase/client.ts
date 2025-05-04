import { initializeApp, getApp, getApps  } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDA2kRg3jB73BbfvbB7QApoAjrycXpCFqM",
  authDomain: "preptonic-6b497.firebaseapp.com",
  projectId: "preptonic-6b497",
  storageBucket: "preptonic-6b497.firebasestorage.app",
  messagingSenderId: "980172547255",
  appId: "1:980172547255:web:3a59dd6b2302d562709932",
  measurementId: "G-DB524RJZC5"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);