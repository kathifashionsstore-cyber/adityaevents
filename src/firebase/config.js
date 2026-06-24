// src/firebase/config.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCV_Z4BPen7wweLOKtiBc2TmECSO6I5A5M",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "adithyaevents-a6140.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "adithyaevents-a6140",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "adithyaevents-a6140.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "202241262091",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:202241262091:web:a418b19a7e4ae1e6acfd0e",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-9Z6C91736V"
};

const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

let messaging = null;
try {
  messaging = getMessaging(app);
} catch (e) {
  console.warn("Firebase Messaging is not supported in this browser context:", e);
}

const functions = getFunctions(app, "asia-south1");

export { app, analytics, db, auth, storage, messaging, functions };
export default app;
