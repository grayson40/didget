// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyBLpV0sQbpMFFOKXK6AuZPlhI8KXXuPSGk",
  authDomain: "didget-5dfd2.firebaseapp.com",
  projectId: "didget-5dfd2",
  storageBucket: "didget-5dfd2.appspot.com",
  messagingSenderId: "43814335159",
  appId: "1:43814335159:web:6e4f17f987956890029332"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
