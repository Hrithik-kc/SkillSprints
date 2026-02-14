"use client";

import { useState, useEffect } from "react";
import { authFeature } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function QuizHome() {
  const router = useRouter();
  const [canViewAnswers, setCanViewAnswers] = useState(false);

  useEffect(() => {
    const checkQuiz = async () => {
      const user = authFeature.currentUser;
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.data()?.lastQuizCompleted) {
        setCanViewAnswers(true);
      }
    };

    checkQuiz();
  }, []);

  return (
    <div className="min-h-screen bg-slate-800 text-white p-8">

      <h1 className="text-3xl font-bold mb-8">Quiz Section</h1>

      <div className="space-y-6">

        <button
          onClick={() => router.push("/quiz/take")}
          className="w-full bg-teal-500 py-4 rounded-lg"
        >
          Take Quiz
        </button>

        <button
          disabled={!canViewAnswers}
          onClick={() => router.push("/quiz/answers")}
          className={`w-full py-4 rounded-lg ${
            canViewAnswers ? "bg-yellow-500" : "bg-gray-500"
          }`}
        >
          Answers
        </button>

        <button
          onClick={() => router.push("/quiz/leader")}
          className="w-full bg-purple-500 py-4 rounded-lg"
        >
          Leaderboard
        </button>

      </div>
    </div>
  );
}
