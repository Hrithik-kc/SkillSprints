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
    <div className="min-h-screen  flex items-center justify-centerbg-gradient-to-br from-slate-800 via-slate-700 to-teal-600 px-4 text-white">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20
      animate-fade-in">

        <button
          onClick={() => router.back()}
          className="mb-5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
        >
          ⬅ Back
        </button>

        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-pink-500 to-indigo-500 flex items-center justify-center text-3xl font-bold shadow-lg animate-pulse">
            {userData?.email?.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-2xl font-bold mt-4">Profile</h2>
          <p className="text-gray-300 text-sm">Gamified Dashboard</p>
        </div>
        <div className="mt-6 space-y-4">

          <div className="flex justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition">
            <span>📧 Email</span>
            <span className="text-gray-200">{userData?.email}</span>
          </div>

          <div className="flex justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition">
            <span>🧠 Level</span>
            <span className="font-semibold">{userData?.level || 0}</span>
          </div>

          <div className="flex justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition">
            <span>🏆 Title</span>
            <span className="text-yellow-400 font-semibold">
              {userData?.title || "Beginner"}
            </span>
          </div>

          <div className="flex justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition">
            <span>⚡ XP</span>
            <span className="text-green-400 font-bold">
              {userData?.xp || 0}
            </span>
          </div>

          <div className="flex justify-between bg-white/10 p-3 rounded-xl hover:bg-white/20 transition">
            <span>📝 Quizzes</span>
            <span>{quizCount}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
