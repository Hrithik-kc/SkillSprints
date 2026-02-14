"use client";

import { useState, useEffect } from "react";

export default function Answers() {
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    const res = await fetch("/api/explanation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ /* pass last questions */ })
    });

    const data = await res.json();
    setSolutions(data.solutions);
  };

  return (
    <div className="p-8 text-white bg-slate-900 min-h-screen">
      {solutions.map((sol, index) => (
        <div key={index} className="mb-6">
          <h3>{sol.question}</h3>
          <p>Correct: {sol.correctAnswer}</p>
          <p>{sol.explanation}</p>
        </div>
      ))}
    </div>
  );
}
