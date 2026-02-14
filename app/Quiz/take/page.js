"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authFeature, db } from "@/lib/firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";

export default function TakeQuiz() {
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [time, setTime] = useState(60);

  useEffect(() => {
    generateQuiz();
  }, []);

  useEffect(() => {
    if (time > 0) {
      const timer = setTimeout(() => setTime(time - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [time]);

  const generateQuiz = async () => {
    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "generate" })
    });

    const data = await res.json();
    setQuestions(data.questions);
  };

  const handleNext = (option) => {
    const updated = [...answers];
    updated[current] = option;
    setAnswers(updated);

    if (current < 4) {
      setCurrent(current + 1);
    }
  };

  const submitQuiz = async () => {
    const res = await fetch("/api/question", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "submit",
        questions,
        userAnswers: answers
      })
    });

    const result = await res.json();
    const user = authFeature.currentUser;

    await addDoc(collection(db, "quizResults"), {
      userId: user.uid,
      score: result.score,
      timeTaken: 60 - time,
      createdAt: new Date()
    });

    await updateDoc(doc(db, "users", user.uid), {
      lastQuizCompleted: true
    });

    router.push("/quiz");
  };

  if (!questions.length) return <div className="p-8">Loading...</div>;

  const q = questions[current];

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">

      <h2 className="mb-4">Time Left: {time}s</h2>

      <h3 className="mb-6">{q.question}</h3>

      {q.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => handleNext(opt)}
          className="block w-full bg-slate-700 mb-2 p-3 rounded"
        >
          {opt}
        </button>
      ))}

      {current === 4 && (
        <button
          onClick={submitQuiz}
          className="mt-4 bg-green-600 px-6 py-2 rounded"
        >
          Submit
        </button>
      )}
    </div>
  );
}
