// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';


const firebaseConfig = {
  apiKey: "AIzaSyDP5a0qE3cu7RiIRFlq4CU_s2UFTLRj5SU",
  authDomain: "didget-development.firebaseapp.com",
  projectId: "didget-development",
  storageBucket: "didget-development.appspot.com",
  messagingSenderId: "730253438625",
  appId: "1:730253438625:web:b152fcc400f260f4544ae0"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase
export const auth = getAuth(app);
export default app;
