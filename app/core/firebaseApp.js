// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
 import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAllVnu8oCvWD4afTYFSan6JCCAmPS0LA",
  authDomain: "placement-7a97e.firebaseapp.com",
  projectId: "placement-7a97e",
  storageBucket: "placement-7a97e.firebasestorage.app",
  messagingSenderId: "699516944359",
  appId: "1:699516944359:web:25d9eb21ad33f6ee7b8742"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const authFeature = getAuth(app);