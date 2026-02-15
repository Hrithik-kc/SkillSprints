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
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-black text-white">

      <nav className="flex justify-between items-center px-8 py-4 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <h2 className="text-2xl font-bold  text-indigo-400">
          🚀 AptiMaster
        </h2>

        <button
          onClick={() => router.push("/profile")}
          className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition duration-300"
        >
          👤 Profile
        </button>
      </nav>

      <div className="flex flex-col items-center justify-center mt-16 px-6">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-xl text-center
        animate-fade-in">

          <h3 className="text-2xl font-semibold mb-2">
            Welcome back 👋
          </h3>

          <p className="text-gray-300 mb-4">
            {userData?.email || "Loading..."}
          </p>

          <div className="flex justify-center gap-6 mb-6 flex-wrap">

            <div className="bg-white/10 px-6 py-4 rounded-xl hover:scale-105 transition">
              <p className="text-sm text-gray-300">Level</p>
              <p className="text-xl font-bold text-indigo-400">
                {userData?.level || 0}
              </p>
            </div>

            <div className="bg-white/10 px-6 py-4 rounded-xl hover:scale-105 transition">
              <p className="text-sm text-gray-300">Title</p>
              <p className="text-xl font-bold text-yellow-400">
                {userData?.title || "Beginner"}
              </p>
            </div>

          </div>
          <div className="flex flex-col gap-4 mt-6">

            <button
              onClick={() => router.push("/practise")}
              className="bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
            >
              🎯 Practice Mode
            </button>

            <button
              onClick={() => router.push("/Quiz")}
              className="bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
            >
              🧠 Quiz Mode
            </button>

            <button
              onClick={() => router.push("/leaderboard")}
              className="bg-pink-600 hover:bg-pink-700 py-3 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
            >
              🏆 Leaderboard
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
