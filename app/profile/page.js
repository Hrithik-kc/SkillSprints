"use client";

import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [quizCount, setQuizCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = authFeature.currentUser;
      if (!user) return;

      const docSnap = await getDoc(doc(db, "users", user.uid));
      setUserData(docSnap.data());

      const q = query(collection(db, "quizResults"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      setQuizCount(snapshot.size);
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => router.back()}>⬅ Back</button>

      <h2>Profile</h2>
      <p>Email: {userData?.email}</p>
      <p>Level: {userData?.level}</p>
      <p>Title: {userData?.title}</p>
      <p>XP: {userData?.xp}</p>
      <p>Quizzes Attempted: {quizCount}</p>
    </div>
  );
}