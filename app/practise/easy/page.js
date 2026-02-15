"use client";

import { useState, useEffect } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { calculateLevel } from "@/lib/levelSystem";
import { useRouter } from "next/navigation";

export default function EasyPractice() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState([]);

  useEffect(() => {
    fetchQuestions();
    fetchUserProgress();
  }, []);

  const fetchQuestions = async () => {
    const snap = await getDoc(doc(db, "practiceQuestions", "easy"));
    if (snap.exists()) {
      setQuestions(snap.data().questions);
    }
  };

  const fetchUserProgress = async () => {
    const user = authFeature.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "users", user.uid));
    const solved =
      snap.data()?.practiceProgress?.easySolvedIndexes || [];

    setCompletedQuestions(solved);
  };

  const handleAnswer = async (selected) => {
    const user = authFeature.currentUser;
    if (!user) return;

    const correct = questions[current].correctAnswer;

    if (selected === correct) {
      setIsCorrect(true);

    
      if (!completedQuestions.includes(current)) {
        const updatedSolved = [...completedQuestions, current];
        setCompletedQuestions(updatedSolved);

        const userRef = doc(db, "users", user.uid);

        await updateDoc(userRef, {
          xp: increment(10),
          "practiceProgress.easyCompleted": increment(1),
          "practiceProgress.easySolvedIndexes": updatedSolved,
        });

        const snap = await getDoc(userRef);
        const newXP = snap.data().xp;

        const { level, title } = calculateLevel(newXP);

        await updateDoc(userRef, { level, title });
      }
    } else {
      setIsCorrect(false);
    }

    setShowSolution(true);
  };

  const nextQuestion = () => {
    setShowSolution(false);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      alert("🎉 Easy Level Completed!");
      router.push("/practice");
    }
  };

  if (!questions.length)
    return <div className="p-8">Loading...</div>;

  const q = questions[current];

  const isAllCompleted =
    completedQuestions.length === questions.length;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

     
      <button
        onClick={() => router.back()}
        className="mb-6 bg-gray-300 px-4 py-2 rounded"
      >
        Back
      </button>

      <h2 className="text-2xl font-bold mb-4">
        Easy Practice
      </h2>

      <p className="mb-4">
        Question {current + 1} / {questions.length}
      </p>

    
      <div className="bg-white p-6 rounded shadow">

        <h3 className="mb-4 font-semibold">
          {q.question}
        </h3>

        {!showSolution &&
          q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              className="block w-full bg-green-200 mt-2 px-4 py-2 rounded hover:bg-green-300"
            >
              {opt}
            </button>
          ))}

        {showSolution && (
          <div className="mt-4">
            <p
              className={`font-bold ${
                isCorrect
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {isCorrect ? "Correct!" : "Wrong!"}
            </p>

            <p className="mt-2">
              <strong>Correct Answer:</strong>{" "}
              {q.correctAnswer}
            </p>

            <p className="mt-2 text-gray-700">
              <strong>Solution:</strong>{" "}
              {q.solution}
            </p>

            <button
              onClick={nextQuestion}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        )}
      </div>

     
      <div className="mt-8 grid grid-cols-10 gap-2">
        {questions.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrent(index);
              setShowSolution(false);
            }}
            className={`py-2 rounded ${
              completedQuestions.includes(index)
                ? "bg-green-500 text-white"
                : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

     
      {isAllCompleted && (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-bold">
            🎉 Easy Completed! Medium Level Unlocked!
          </p>
        </div>
      )}
    </div>
  );
}
