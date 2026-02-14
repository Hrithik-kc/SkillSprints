"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authFeature, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(120);
  const router = useRouter();

  useEffect(() => {
    const timer = time > 0 && setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time]);

  const startQuiz = async () => {
    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ difficulty: "medium" }),
    });

    const data = await res.json();
    const text = data.candidates[0].content.parts[0].text;
    setQuestions(JSON.parse(text));
  };

  const selectAnswer = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  const submitQuiz = async () => {
    const user = authFeature.currentUser;
    let score = 0;
    let correctAnswers = [];

    questions.forEach((q, index) => {
      correctAnswers.push(q.correctAnswer);
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    await addDoc(collection(db, "quizResults"), {
      userId: user.uid,
      score,
      timeTaken: 120 - time,
      totalQuestions: questions.length,
      createdAt: new Date(),
    });

    await addDoc(collection(db, "quizAnswers"), {
      userId: user.uid,
      questions,
      selectedAnswers: answers,
      correctAnswers,
    });

    router.push("/quiz/result");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button onClick={() => router.back()} className="mb-4 bg-gray-300 px-4 py-2 rounded">
        Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Quiz Mode</h1>
      <p className="mb-4">Time Left: {time}s</p>

      <button onClick={startQuiz} className="bg-blue-500 text-white px-4 py-2 rounded mb-6">
        Take Quiz
      </button>

      {questions.map((q, index) => (
        <div key={index} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="font-semibold">{q.question}</h3>

          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(index, opt)}
              className="block w-full text-left bg-gray-200 mt-2 px-3 py-2 rounded"
            >
              {opt}
            </button>
          ))}
        </div>
      ))}

      {questions.length > 0 && (
        <button onClick={submitQuiz} className="bg-green-600 text-white px-6 py-2 rounded">
          Submit Quiz
        </button>
      )}
    </div>
  );
}
