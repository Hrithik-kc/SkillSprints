"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  doc,
  increment
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Leaderboard() {
  const [results, setResults] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    const today = new Date().toISOString().split("T")[0];

    const q = query(
      collection(db, "quizResults"),
      where("dateKey", "==", today),
      orderBy("score", "desc"),
      orderBy("timeTaken", "asc")
    );

    const snap = await getDocs(q);

    const docs = snap.docs;

    const data = docs.map((docItem) => ({
      id: docItem.id,
      ...docItem.data()
    }));

    setResults(data);

    rewardTop3(docs);
  };

  const rewardTop3 = async (docs) => {
    const rewards = [100, 70, 50];

    for (let i = 0; i < Math.min(3, docs.length); i++) {
      const quizDoc = docs[i];
      const quizData = quizDoc.data();

      if (!quizData.rewardGiven) {
    
        await updateDoc(doc(db, "users", quizData.userId), {
          xp: increment(rewards[i])
        });

      
        await updateDoc(doc(db, "quizResults", quizDoc.id), {
          rewardGiven: true
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <button
        onClick={() => router.push("/Quiz")}
        className="mb-6 bg-gray-700 px-4 py-2 rounded"
      >
        Back
      </button>

      <h1 className="text-3xl text-center mb-8">
        🏆 Daily Leaderboard
      </h1>

      {results.map((player, index) => (
        <div
          key={player.id}
          className={`flex justify-between p-4 mb-3 rounded ${
            index === 0
              ? "bg-yellow-500 text-black"
              : index === 1
              ? "bg-gray-300 text-black"
              : index === 2
              ? "bg-orange-400 text-black"
              : "bg-slate-800"
          }`}
        >
          <div>#{index + 1}</div>
          <div>Score: {player.score}</div>
          <div>Time: {player.timeTaken}s</div>
        </div>
      ))}

    </div>
  );
}
