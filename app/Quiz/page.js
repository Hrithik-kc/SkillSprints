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


// "use client";

// import { useState, useEffect } from "react";
// import { authFeature } from "@/lib/firebase";
// import { useRouter } from "next/navigation";
// <<<<<<< HEAD
// import { getDoc, doc } from "firebase/firestore";
// import { db } from "@/lib/firebase";

// export default function QuizHome() {
// =======
// import { authFeature, db } from "@/lib/firebase";
// import { collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";

// export default function Quiz() {
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [time, setTime] = useState(1200); // 20 minutes
//   const [isQuizStarted, setIsQuizStarted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [difficulty, setDifficulty] = useState("medium");
//   const [quizType, setQuizType] = useState("practice");
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
// >>>>>>> d0308c31537cfa60993e24a376b02f0c27d77e7f
//   const router = useRouter();
//   const [canViewAnswers, setCanViewAnswers] = useState(false);

//   useEffect(() => {
// <<<<<<< HEAD
//     const checkQuiz = async () => {
//       const user = authFeature.currentUser;
//       if (!user) return;

//       const snap = await getDoc(doc(db, "users", user.uid));
//       if (snap.data()?.lastQuizCompleted) {
//         setCanViewAnswers(true);
// =======
//     if (isQuizStarted && time > 0) {
//       const timer = setTimeout(() => setTime(time - 1), 1000);
//       return () => clearTimeout(timer);
//     } else if (time === 0 && isQuizStarted) {
//       handleAutoSubmit();
//     }
//   }, [time, isQuizStarted]);

//   const formatTime = (seconds) => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const startQuiz = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/question", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ 
//           difficulty: difficulty,
//           count: quizType === "practice" ? 10 : 20 
//         }),
//       });

//       if (!res.ok) throw new Error("Failed to fetch questions");

//       const data = await res.json();
//       const text = data.candidates[0].content.parts[0].text;
//       const parsedQuestions = JSON.parse(text.replace(/```json|```/g, "").trim());
      
//       setQuestions(parsedQuestions);
//       setIsQuizStarted(true);
//       setTime(quizType === "practice" ? 600 : 1200); // 10 or 20 minutes
//     } catch (error) {
//       console.error("Error starting quiz:", error);
//       alert("Failed to load quiz questions. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectAnswer = (qIndex, option) => {
//     setAnswers({ ...answers, [qIndex]: option });
//   };

//   const handleAutoSubmit = async () => {
//     await submitQuiz();
//   };

//   const submitQuiz = async () => {
//     const user = authFeature.currentUser;
//     if (!user) return;

//     let score = 0;
//     let correctAnswers = [];
//     let explanations = [];

//     questions.forEach((q, index) => {
//       correctAnswers.push(q.correctAnswer);
//       explanations.push(q.explanation || "No explanation provided");
//       if (answers[index] === q.correctAnswer) {
//         score++;
// >>>>>>> d0308c31537cfa60993e24a376b02f0c27d77e7f
//       }
//     };

// <<<<<<< HEAD
//     checkQuiz();
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-800 text-white p-8">

//       <h1 className="text-3xl font-bold mb-8">Quiz Section</h1>

//       <div className="space-y-6">

//         <button
//           onClick={() => router.push("/quiz/take")}
//           className="w-full bg-teal-500 py-4 rounded-lg"
//         >
//           Take Quiz
//         </button>

//         <button
//           disabled={!canViewAnswers}
//           onClick={() => router.push("/quiz/answers")}
//           className={`w-full py-4 rounded-lg ${
//             canViewAnswers ? "bg-yellow-500" : "bg-gray-500"
//           }`}
//         >
//           Answers
//         </button>

//         <button
//           onClick={() => router.push("/quiz/leader")}
//           className="w-full bg-purple-500 py-4 rounded-lg"
//         >
//           Leaderboard
//         </button>

//       </div>
// =======
//     const scorePercentage = Math.round((score / questions.length) * 100);
//     const timeTaken = quizType === "practice" ? 600 - time : 1200 - time;

//     // Save quiz result
//     await addDoc(collection(db, "quizResults"), {
//       userId: user.uid,
//       score: scorePercentage,
//       correctCount: score,
//       totalQuestions: questions.length,
//       timeTaken: timeTaken,
//       difficulty: difficulty,
//       quizType: quizType,
//       timestamp: new Date(),
//     });

//     // Save detailed answers for review
//     await addDoc(collection(db, "quizAnswers"), {
//       userId: user.uid,
//       questions,
//       selectedAnswers: answers,
//       correctAnswers,
//       explanations,
//       timestamp: new Date(),
//     });

//     // Update user stats
//     const userRef = doc(db, "users", user.uid);
//     await updateDoc(userRef, {
//       xp: increment(scorePercentage),
//       totalQuizzes: increment(1),
//       lastQuizDate: new Date(),
//     });

//     // Navigate to results
//     router.push(`/quiz/result?score=${scorePercentage}&correct=${score}&total=${questions.length}`);
//   };

//   const handleSubmitClick = () => {
//     const unanswered = questions.length - Object.keys(answers).length;
//     if (unanswered > 0) {
//       setShowSubmitModal(true);
//     } else {
//       submitQuiz();
//     }
//   };

//   const getAnsweredCount = () => {
//     return Object.keys(answers).length;
//   };

//   const getProgressPercentage = () => {
//     return (getAnsweredCount() / questions.length) * 100;
//   };

//   if (!isQuizStarted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//         {/* Header */}
//         <div className="bg-white shadow-sm border-b">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <button
//               onClick={() => router.push("/dashboard")}
//               className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
//             >
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//               Back to Dashboard
//             </button>
//           </div>
//         </div>

//         {/* Quiz Setup */}
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">Start Your Quiz</h1>
//             <p className="text-lg text-gray-600">Choose your preferences and begin your assessment</p>
//           </div>

//           <div className="bg-amber-50 rounded-2xl shadow-xl p-8 space-y-8">
//             {/* Quiz Type Selection */}
//             <div>
//               <label className="block text-lg font-semibold text-gray-900 mb-4">Quiz Type</label>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <button
//                   onClick={() => setQuizType("practice")}
//                   className={`p-6 rounded-xl border-2 transition-all ${
//                     quizType === "practice"
//                       ? "border-indigo-600 bg-indigo-50"
//                       : "border-gray-200 hover:border-indigo-300"
//                   }`}
//                 >
//                   <div className="text-3xl mb-3">📚</div>
//                   <h3 className="font-bold text-xl mb-2">Practice Mode</h3>
//                   <p className="text-gray-600 text-sm">10 questions • 10 minutes • No pressure</p>
//                 </button>

//                 <button
//                   onClick={() => setQuizType("competitive")}
//                   className={`p-6 rounded-xl border-2 transition-all ${
//                     quizType === "competitive"
//                       ? "border-indigo-600 bg-indigo-50"
//                       : "border-gray-200 hover:border-indigo-300"
//                   }`}
//                 >
//                   <div className="text-3xl mb-3">🏆</div>
//                   <h3 className="font-bold text-xl mb-2">Competitive Mode</h3>
//                   <p className="text-gray-600 text-sm">20 questions • 20 minutes • Leaderboard</p>
//                 </button>
//               </div>
//             </div>

//             {/* Difficulty Selection */}
//             <div>
//               <label className="block text-lg font-semibold text-gray-900 mb-4">Difficulty Level</label>
//               <div className="grid grid-cols-3 gap-4">
//                 <button
//                   onClick={() => setDifficulty("easy")}
//                   className={`p-4 rounded-xl border-2 transition-all ${
//                     difficulty === "easy"
//                       ? "border-green-500 bg-green-50"
//                       : "border-gray-200 hover:border-green-300"
//                   }`}
//                 >
//                   <div className="text-2xl mb-2">🟢</div>
//                   <h4 className="font-semibold">Easy</h4>
//                   <p className="text-xs text-gray-500 mt-1">Beginner friendly</p>
//                 </button>

//                 <button
//                   onClick={() => setDifficulty("medium")}
//                   className={`p-4 rounded-xl border-2 transition-all ${
//                     difficulty === "medium"
//                       ? "border-yellow-500 bg-yellow-50"
//                       : "border-gray-200 hover:border-yellow-300"
//                   }`}
//                 >
//                   <div className="text-2xl mb-2">🟡</div>
//                   <h4 className="font-semibold">Medium</h4>
//                   <p className="text-xs text-gray-500 mt-1">Moderate challenge</p>
//                 </button>

//                 <button
//                   onClick={() => setDifficulty("hard")}
//                   className={`p-4 rounded-xl border-2 transition-all ${
//                     difficulty === "hard"
//                       ? "border-red-500 bg-red-50"
//                       : "border-gray-200 hover:border-red-300"
//                   }`}
//                 >
//                   <div className="text-2xl mb-2">🔴</div>
//                   <h4 className="font-semibold">Hard</h4>
//                   <p className="text-xs text-gray-500 mt-1">Expert level</p>
//                 </button>
//               </div>
//             </div>

//             {/* Quiz Info */}
//             <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
//               <h3 className="font-semibold text-lg mb-3">Quiz Information</h3>
//               <div className="space-y-2 text-sm text-gray-700">
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   <span>Questions: {quizType === "practice" ? "10" : "20"} aptitude questions</span>
//                 </div>
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <span>Time: {quizType === "practice" ? "10" : "20"} minutes</span>
//                 </div>
//                 <div className="flex items-center">
//                   <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
//                   </svg>
//                   <span>XP Reward: Based on performance</span>
//                 </div>
//               </div>
//             </div>

//             {/* Start Button */}
//             <button
//               onClick={startQuiz}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center">
//                   <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                   </svg>
//                   Loading Questions...
//                 </span>
//               ) : (
//                 "Start Quiz"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       {/* Fixed Header with Timer */}
//       <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             {/* Progress Info */}
//             <div className="flex items-center space-x-4">
//               <span className="text-sm font-semibold text-gray-600">
//                 Question {currentQuestion + 1} of {questions.length}
//               </span>
//               <div className="hidden sm:block w-48 bg-gray-200 rounded-full h-2">
//                 <div
//                   className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
//                   style={{ width: `${getProgressPercentage()}%` }}
//                 />
//               </div>
//             </div>

//             {/* Timer */}
//             <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
//               time < 60 ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"
//             }`}>
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="font-bold text-lg">{formatTime(time)}</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Question Card */}
//           <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
//             <div className="flex items-start justify-between mb-6">
//               <div className="flex-1">
//                 <div className="flex items-center space-x-3 mb-4">
//                   <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
//                     {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
//                   </span>
//                   <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
//                     {quizType === "practice" ? "Practice" : "Competitive"}
//                   </span>
//                 </div>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">
//                   Question {currentQuestion + 1}
//                 </h2>
//                 <p className="text-lg text-gray-700 leading-relaxed">
//                   {questions[currentQuestion]?.question}
//                 </p>
//               </div>
//             </div>

//             {/* Options */}
//             <div className="space-y-3">
//               {questions[currentQuestion]?.options?.map((option, index) => (
//                 <button
//                   key={index}
//                   onClick={() => selectAnswer(currentQuestion, option)}
//                   className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
//                     answers[currentQuestion] === option
//                       ? "border-indigo-600 bg-indigo-50"
//                       : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center">
//                     <div className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
//                       answers[currentQuestion] === option
//                         ? "border-indigo-600 bg-indigo-600"
//                         : "border-gray-300"
//                     }`}>
//                       {answers[currentQuestion] === option && (
//                         <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
//                           <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                         </svg>
//                       )}
//                     </div>
//                     <span className="font-medium">{option}</span>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Navigation */}
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
//               disabled={currentQuestion === 0}
//               className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               ← Previous
//             </button>

//             <div className="text-center">
//               <p className="text-sm text-gray-600 mb-2">
//                 Answered: {getAnsweredCount()} / {questions.length}
//               </p>
//               <div className="flex space-x-1">
//                 {questions.map((_, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => setCurrentQuestion(idx)}
//                     className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
//                       idx === currentQuestion
//                         ? "bg-indigo-600 text-white"
//                         : answers[idx]
//                         ? "bg-green-500 text-white"
//                         : "bg-gray-200 text-gray-600 hover:bg-gray-300"
//                     }`}
//                   >
//                     {idx + 1}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {currentQuestion === questions.length - 1 ? (
//               <button
//                 onClick={handleSubmitClick}
//                 className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
//               >
//                 Submit Quiz →
//               </button>
//             ) : (
//               <button
//                 onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
//                 className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
//               >
//                 Next →
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Submit Confirmation Modal */}
//       {showSubmitModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
//             <div className="text-center mb-6">
//               <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
//                 <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">Are you sure?</h3>
//               <p className="text-gray-600">
//                 You have {questions.length - getAnsweredCount()} unanswered question(s).
//               </p>
//             </div>
//             <div className="space-y-3">
//               <button
//                 onClick={() => {
//                   setShowSubmitModal(false);
//                   submitQuiz();
//                 }}
//                 className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
//               >
//                 Submit Anyway
//               </button>
//               <button
//                 onClick={() => setShowSubmitModal(false)}
//                 className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
//               >
//                 Continue Quiz
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
// >>>>>>> d0308c31537cfa60993e24a376b02f0c27d77e7f
//     </div>
//   );
// }