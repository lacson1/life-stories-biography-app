import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0rccYxhSCcDrT0I3l2xGj0iAR_-sIu-M",
  authDomain: "biographi-28eed.firebaseapp.com",
  projectId: "biographi-28eed",
  storageBucket: "biographi-28eed.firebasestorage.app",
  messagingSenderId: "513138653331",
  appId: "1:513138653331:web:879a746e8d185e8f31f566",
  measurementId: "G-F4N6MCQYBL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
