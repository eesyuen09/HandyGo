// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYzP2FujWROHwnaYsYZNbD75frjiwi_AI",
  authDomain: "handygo-123.firebaseapp.com",
  projectId: "handygo-123",
  storageBucket: "handygo-123.firebasestorage.app",
  messagingSenderId: "158473300904",
  appId: "1:158473300904:web:6799ece7a239f0409a0b9d",
  measurementId: "G-J3NBDHE6KM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Firestore
const db = getFirestore(app);

export { auth, db };