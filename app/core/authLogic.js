import { authFeature, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

export async function registerComponent(email, password, router) {
  try {
    const result = await createUserWithEmailAndPassword(
      authFeature,
      email,
      password
    );

    const user = result.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      role: "student",
      xp: 0,
      level: 1,
      title: "Beginner",
      leaderboardPoints: 0,
      createdAt: new Date(),
    });

    alert("Account created successfully. Please login.");
    router.push("/login");

  } catch (err) {

    if (err.code === "auth/email-already-in-use") {
      alert("Account already exists. Please login.");
      router.push("/login");
      return;
    }

    alert("Unable to create account. Please try again.");
  }
}

export async function loginComponent(
  email,
  password,
  role,
  teacherId,
  router
) {

  const HARD_CODED_TEACHER_ID = "SUPER999";

  try {

    const result = await signInWithEmailAndPassword(
      authFeature,
      email,
      password
    );

    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      alert("Authentication failed.");
      return;
    }

    if (role === "admin") {

      if (teacherId !== HARD_CODED_TEACHER_ID) {
        alert("Authentication failed.");
        return;
      }

      await updateDoc(userRef, {
        role: "admin",
      });

      localStorage.setItem("isAuthenticated", "true");
      window.dispatchEvent(new Event("storage"));

      router.push("/admin-dashboard");

    } else {

      localStorage.setItem("isAuthenticated", "true");
      window.dispatchEvent(new Event("storage"));

      router.push("/dashboard");
    }

  } catch {
    alert("Authentication failed.");
  }
}