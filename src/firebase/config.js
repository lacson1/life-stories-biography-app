import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration with environment variable support
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyB0rccYxhSCcDrT0I3l2xGj0iAR_-sIu-M",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "biographi-28eed.firebaseapp.com",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "biographi-28eed",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "biographi-28eed.firebasestorage.app",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "513138653331",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:513138653331:web:879a746e8d185e8f31f566",
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-F4N6MCQYBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;