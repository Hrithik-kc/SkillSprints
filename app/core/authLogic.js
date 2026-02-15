import { authFeature, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";


const ADMIN_EMAIL = "teacher@gmail.com";


export async function loginComponent(email, password) {
  try {
    const result = await signInWithEmailAndPassword(
      authFeature,
      email,
      password
    );

    alert("You have logged in successfully!!!");


    return result;

  } catch (err) {
    console.log(JSON.stringify(err));
    alert("You have not registered yet. Kindly register to continue.");
    throw err;
  }
}



export async function registerComponent(email, password, role) {
  try {

    
    if (role === "admin" && email !== ADMIN_EMAIL) {
      role = "student";
    }

    const result = await createUserWithEmailAndPassword(
      authFeature,
      email,
      password
    );

    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      role,
      xp: 0,
      level: 1,
      title: "Beginner",
      leaderboardPoints: 0,
      createdAt: new Date(),
    });

    alert("You have registered successfully!! Kindly Login to continue.");

    return result;

  } catch (err) {
    

    if (err.code === "auth/email-already-in-use") {
      alert("This email is already registered. Please login instead.");
    

    } else if (err.code === "auth/invalid-email") {
      alert("Please enter a valid email address.");
   

    } else if (err.code === "auth/weak-password") {
      alert("Password should be at least 6 characters.");
    

    } else {
      alert("Registration failed. Please try again.");
    
    }
  }
}
