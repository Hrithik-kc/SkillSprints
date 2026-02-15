"use client";

import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function PracticeHome() {
  const [progress, setProgress] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      const user = authFeature.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      setProgress(snap.data()?.practiceProgress);
    };

    fetchProgress();
  }, []);

  const isMediumUnlocked = progress?.easyCompleted >= 30;
  const isHardUnlocked = progress?.mediumCompleted >= 30;

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <button
        onClick={() => router.push("/dashboard")}
        className="mb-6 bg-gray-300 px-4 py-2 rounded"
      >
        Back
      </button>

      <h1 className="text-3xl font-bold mb-8">Practice Mode</h1>

      <div className="space-y-6">

        <button
          onClick={() => router.push("/practice/easy")}
          className="w-full bg-green-500 text-white py-4 rounded text-lg"
        >
          Easy (10 XP per question)
        </button>

        <button
          disabled={!isMediumUnlocked}
          onClick={() => router.push("/practice/medium")}
          className={`w-full py-4 rounded text-lg ${
            isMediumUnlocked
              ? "bg-yellow-500 text-white"
              : "bg-gray-400 text-gray-700"
          }`}
        >
          Medium (20 XP per question)
        </button>

        <button
          disabled={!isHardUnlocked}
          onClick={() => router.push("/practice/hard")}
          className={`w-full py-4 rounded text-lg ${
            isHardUnlocked
              ? "bg-red-500 text-white"
              : "bg-gray-400 text-gray-700"
          }`}
        >
          Hard (30 XP per question)
        </button>

      </div>
    </div>
  );
}
