"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { calculateLevel } from "@/lib/levelSystem";
import { useRouter } from "next/navigation";

export default function EasyPractice() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const snap = await getDoc(doc(db, "practiceQuestions", "medium"));
    setQuestions(snap.data().questions);
  };

  const handleAnswer = async (selected) => {
    const user = auth.currentUser;
    const correct = questions[current].correctAnswer;

    if (selected === correct) {
      setIsCorrect(true);

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        xp: increment(20),
        "practiceProgress.mediumCompleted": increment(1),
      });

      const snap = await getDoc(userRef);
      const newXP = snap.data().xp;

      const { level, title } = calculateLevel(newXP);

      await updateDoc(userRef, { level, title });

    } else {
      setIsCorrect(false);
    }

    setShowSolution(true);
  };

  const nextQuestion = () => {
    setShowSolution(false);
    if (current < 29) {
      setCurrent(current + 1);
    } else {
      alert("Easy Completed!");
      router.push("/practice");
    }
  };

  if (!questions.length) return <div className="p-8">Loading...</div>;

  const q = questions[current];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-300 px-4 py-2 rounded"
      >
        Back
      </button>

      <h2 className="text-2xl font-bold mb-4">Easy Practice</h2>
      <p className="mb-4">Question {current + 1} / 30</p>

      <div className="bg-white p-6 rounded shadow">

        <h3 className="mb-4">{q.question}</h3>

        {!showSolution &&
          q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="block w-full bg-green-200 mt-2 px-4 py-2 rounded"
            >
              {opt}
            </button>
          ))}

        {showSolution && (
          <div className="mt-4">
            <p className={`font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Correct!" : "Wrong!"}
            </p>

            <p className="mt-2">
              <strong>Correct Answer:</strong> {q.correctAnswer}
            </p>

            <p className="mt-2 text-gray-700">
              <strong>Solution:</strong> {q.solution}
            </p>

            <button
              onClick={nextQuestion}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
