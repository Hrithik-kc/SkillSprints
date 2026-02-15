"use client";

import { useEffect, useState } from "react";
import { db, authFeature } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Answers() {
  const [quizData, setQuizData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchLastQuiz();
  }, []);

  const fetchLastQuiz = async () => {
    const user = authFeature.currentUser;
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    const q = query(
      collection(db, "quizResults"),
      where("userId", "==", user.uid),
      where("dateKey", "==", today),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const snap = await getDocs(q);

    if (!snap.empty) {
      setQuizData(snap.docs[0].data());
    }
  };

  if (!quizData) return <div className="p-8 text-white bg-slate-900">Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <button
        onClick={() => router.push("/Quiz")}
        className="mb-6 bg-gray-700 px-4 py-2 rounded"
      >
        Back
      </button>

      <h1 className="text-2xl mb-6">
        Score: {quizData.score} / {quizData.total}
      </h1>

      {quizData.questions.map((q, i) => {
        const userAnswer = quizData.userAnswers[i];
        const correct = userAnswer === q.correctAnswer;

        return (
          <div key={i} className="mb-6 bg-slate-800 p-4 rounded">
            <h3>Q{i + 1}: {q.question}</h3>
            <p>Your Answer: {userAnswer}</p>
            <p>Correct Answer: {q.correctAnswer}</p>
            <p>Explanation: {quizData.explanations[i]}</p>
            <p className={correct ? "text-green-500" : "text-red-500"}>
              {correct ? "Correct" : "Wrong"}
            </p>
          </div>
        );
      })}
    </div>
  );
}
