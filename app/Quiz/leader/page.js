"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, doc, updateDoc, increment } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Leaderboard() {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const q = query(
        collection(db, "quizResults"),
        orderBy("score", "desc"),
        orderBy("timeTaken", "asc")
      );

      const snapshot = await getDocs(q);

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setResults(data);
      setLoading(false);

      rewardTopPlayers(data);

    } catch (error) {
      console.log(error);
    }
  };


  const rewardTopPlayers = async (data) => {
    const rewards = [100, 70, 50, 30, 20];

    for (let i = 0; i < Math.min(5, data.length); i++) {
      const userId = data[i].userId;

      await updateDoc(doc(db, "users", userId), {
        xp: increment(rewards[i])
      });
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Loading Leaderboard...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <button
        onClick={() => router.push("/quiz")}
        className="mb-6 px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
      >
        ⬅ Back
      </button>

      <h1 className="text-3xl font-bold mb-8 text-center">
        🏆 Leaderboard
      </h1>

      <div className="max-w-3xl mx-auto space-y-4">

        {results.map((player, index) => (
          <div
            key={player.id}
            className={`flex justify-between items-center p-4 rounded-lg shadow-lg
            ${
              index === 0
                ? "bg-yellow-500 text-black"
                : index === 1
                ? "bg-gray-300 text-black"
                : index === 2
                ? "bg-orange-400 text-black"
                : "bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold">#{index + 1}</span>
              <span>User ID: {player.userId.slice(0, 6)}...</span>
            </div>

            <div className="text-right">
              <p>Score: {player.score}</p>
              <p>Time: {player.timeTaken}s</p>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
