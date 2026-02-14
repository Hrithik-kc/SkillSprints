"use client";
import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = authFeature.currentUser;
      if (!user) return;

      const docSnap = await getDoc(doc(db, "users", user.uid));
      setUserData(docSnap.data());
    };
    fetchUser();
  }, []);

  return (
    <div>
      <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#111", color: "#fff" }}>
        <h2>🚀 AptiMaster</h2>
        <button onClick={() => router.push("/profile")}>👤</button>
      </nav>
      <div style={{ padding: "20px" }}>
        <h3>Welcome {userData?.email}</h3>
        <p>Level: {userData?.level}</p>
        <p>Title: {userData?.title}</p>
        <hr />
        <button onClick={() => router.push("/practice")}>Practice Mode</button>
        <br /><br />
        <button onClick={() => router.push("/quiz")}>Quiz Mode</button>
        <br /><br />
        <button onClick={() => router.push("/leaderboard")}>Leaderboard</button>
      </div>
    </div>
  );
}