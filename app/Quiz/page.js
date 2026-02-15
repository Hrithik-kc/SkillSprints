"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, authFeature } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function QuizHome() {
  const router = useRouter();
  const [canTake, setCanTake] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const user = authFeature.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "quizResults"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      const lastQuiz = snap.docs[0].data();
      const lastTime = lastQuiz.createdAt.toDate();
      const now = new Date();

      const diffHours = (now - lastTime) / (1000 * 60 * 60);

      if (diffHours < 24) {
        setCanTake(false);
        setCompleted(true);
      } else {
        setCanTake(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <h1 className="text-3xl font-bold mb-10 text-center">
        Quiz Section
      </h1>

      <div className="space-y-6 max-w-md mx-auto">

        <button
          disabled={!canTake}
          onClick={() => router.push("/Quiz/take")}
          className={`w-full py-4 rounded-lg ${
            canTake ? "bg-teal-500" : "bg-gray-500"
          }`}
        >
          Take Quiz
        </button>

        <button
          disabled={!completed}
          onClick={() => router.push("/Quiz/answers")}
          className={`w-full py-4 rounded-lg ${
            completed ? "bg-yellow-500" : "bg-gray-500"
          }`}
        >
          Answers
        </button>

        <button
          disabled={!completed}
          onClick={() => router.push("/Quiz/leader")}
          className={`w-full py-4 rounded-lg ${
            completed ? "bg-purple-500" : "bg-gray-500"
          }`}
        >
          Leaderboard
        </button>

      </div>
    </div>
  );
}
