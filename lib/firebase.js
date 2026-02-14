// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
 import {getAuth} from "firebase/auth"
 import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA1M9dpS2P2-Gs-OOdGQB9NyCthhbv9OKk",
  authDomain: "hackathon-5f743.firebaseapp.com",
  projectId: "hackathon-5f743",
  storageBucket: "hackathon-5f743.firebasestorage.app",
  messagingSenderId: "951697461059",
  appId: "1:951697461059:web:6d428d7510228aab53e9f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authFeature = getAuth(app);
export const db=getFirestore(app)