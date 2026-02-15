"use client";

import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function MediumPracticeHome() {
  const [progress, setProgress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      const user = authFeature.currentUser;
      if (!user) return;

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        setProgress(snap.data()?.practiceProgress);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchProgress();
  }, []);

  const isEasyUnlocked = true; 
  const isMediumUnlocked = progress?.easySolvedIndexes?.length > 0;
  const isHardUnlocked = progress?.mediumSolvedIndexes?.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-8 flex flex-col items-center">

      <button
        onClick={() => router.push("/dashboard")}
        className="self-start mb-6 bg-white/20 hover:bg-white/30 text-black px-5 py-2 rounded-lg border border-black/10 font-medium transition"
      >
        ← Back
      </button>

      <h1 className="text-4xl font-bold mb-10 text-yellow-900">Practice Mode</h1>

      <div className="w-full max-w-md space-y-6">

        <button
          onClick={() => router.push("/practise/easy")}
          className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition transform hover:scale-105 ${
            isEasyUnlocked
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Easy (10 XP per question)
        </button>

        <button
          disabled={!isMediumUnlocked}
          onClick={() => router.push("/practise/medium")}
          className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition transform hover:scale-105 ${
            isMediumUnlocked
              ? "bg-yellow-500 text-white hover:bg-yellow-600"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Medium (20 XP per question)
        </button>

        <button
          disabled={!isHardUnlocked}
          onClick={() => router.push("/practise/hard")}
          className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition transform hover:scale-105 ${
            isHardUnlocked
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
          }`}
        >
          Hard (30 XP per question)
        </button>

      </div>

      <div className="mt-10 text-center text-sm text-gray-600 max-w-md">
        <p>Medium unlocks after completing all Easy question.</p>
        <p>Hard unlocks after completing all Medium question.</p>
      </div>
    </div>
  );
}
