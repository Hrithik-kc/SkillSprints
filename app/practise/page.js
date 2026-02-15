// "use client";

// import { useEffect, useState } from "react";
// import { authFeature, db } from "@/lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useRouter } from "next/navigation";

// export default function MediumPracticeHome() {
//   const [progress, setProgress] = useState(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProgress = async () => {
//       const user = authFeature.currentUser;
//       if (!user) return;

//       try {
//         const snap = await getDoc(doc(db, "users", user.uid));
//         setProgress(snap.data()?.practiceProgress);
//       } catch (err) {
//         console.error("Error fetching progress:", err);
//       }
//     };

//     fetchProgress();
//   }, []);

//   const isEasyUnlocked = true; 
//   const isMediumUnlocked = progress?.easySolvedIndexes?.length > 0;
//   const isHardUnlocked = progress?.mediumSolvedIndexes?.length > 0;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-8 flex flex-col items-center">

//       <button
//         onClick={() => router.push("/dashboard")}
//         className="self-start mb-6 bg-white/20 hover:bg-white/30 text-black px-5 py-2 rounded-lg border border-black/10 font-medium transition"
//       >
//         ← Back
//       </button>

//       <h1 className="text-4xl font-bold mb-10 text-yellow-900">Practice Mode</h1>

//       <div className="w-full max-w-md space-y-6">

//         <button
//           onClick={() => router.push("/practise/easy")}
//           className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition transform hover:scale-105 ${
//             isEasyUnlocked
//               ? "bg-green-500 text-white hover:bg-green-600"
//               : "bg-gray-400 text-gray-700 cursor-not-allowed"
//           }`}
//         >
//           Easy (10 XP per question)
//         </button>

//         <button
//           disabled={!isMediumUnlocked}
//           onClick={() => router.push("/practise/medium")}
//           className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition transform hover:scale-105 ${
//             isMediumUnlocked
//               ? "bg-yellow-500 text-white hover:bg-yellow-600"
//               : "bg-gray-400 text-gray-700 cursor-not-allowed"
//           }`}
//         >
//           Medium (20 XP per question)
//         </button>

//         <button
//           disabled={!isHardUnlocked}
//           onClick={() => router.push("/practise/hard")}
//           className={`w-full py-4 rounded-xl text-lg font-semibold shadow-md transition transform hover:scale-105 ${
//             isHardUnlocked
//               ? "bg-red-500 text-white hover:bg-red-600"
//               : "bg-gray-400 text-gray-700 cursor-not-allowed"
//           }`}
//         >
//           Hard (30 XP per question)
//         </button>

//       </div>

//       <div className="mt-10 text-center text-sm text-gray-600 max-w-md">
//         <p>Medium unlocks after completing all Easy question.</p>
//         <p>Hard unlocks after completing all Medium question.</p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function MediumPracticeHome() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProgress = async () => {
      const user = authFeature.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        setProgress(snap.data()?.practiceProgress || {});
      } catch (err) {
        console.error("Error fetching progress:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const isEasyUnlocked = true;
  const isMediumUnlocked = progress?.easySolvedIndexes?.length > 0;
  const isHardUnlocked = progress?.mediumSolvedIndexes?.length > 0;

  const getProgressPercentage = (difficulty) => {
    const total = 100; // Assuming 100 questions per difficulty
    if (difficulty === "easy") {
      return ((progress?.easySolvedIndexes?.length || 0) / total) * 100;
    }
    if (difficulty === "medium") {
      return ((progress?.mediumSolvedIndexes?.length || 0) / total) * 100;
    }
    if (difficulty === "hard") {
      return ((progress?.hardSolvedIndexes?.length || 0) / total) * 100;
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-yellow-400 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🎯</span>
            </div>
          </div>
          <p className="text-white font-bold text-xl mt-6">Loading Practice Mode...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
      
        {/* Floating Icons */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-yellow-300 animate-pulse opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 20 + 15}px`
            }}
          >
          
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-white hover:text-yellow-400 transition-colors group"
          >
            <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-16">
          <div className="inline-block">
            <div className="relative">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 mb-4 ">
                 PRACTICE MODE 
              </h1>
            
            </div>
          </div>
          <p className="text-2xl text-yellow-200 font-bold mt-6">
             Master your skills, level by level! 
          </p>
          <p className="text-lg text-blue-200 mt-3">
            Complete each difficulty to unlock the next challenge
          </p>
        </div>

        {/* Difficulty Cards */}
        <div className="space-y-8">
          {/* Easy Level */}
          <div className="relative group">
            <div className={`absolute -inset-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl blur ${
              isEasyUnlocked ? "opacity-50 group-hover:opacity-75" : "opacity-20"
            } transition-opacity`}></div>
            <div className="relative">
              <button
                onClick={() => isEasyUnlocked && router.push("/practise/easy")}
                disabled={!isEasyUnlocked}
                className={`w-full p-8 rounded-2xl transition-all transform ${
                  isEasyUnlocked
                    ? "bg-gradient-to-br from-green-800/80 to-emerald-900/80 hover:scale-[1.02] cursor-pointer"
                    : "bg-gray-800/50 cursor-not-allowed"
                } backdrop-blur-xl border-2 ${
                  isEasyUnlocked ? "border-green-400/50" : "border-gray-600/30"
                } shadow-2xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Icon */}
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl ${
                      isEasyUnlocked
                        ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/50"
                        : "bg-gray-700"
                    } border-4 border-white/20`}>
                      {isEasyUnlocked ? "🟢" : "🔒"}
                    </div>

                    {/* Info */}
                    <div className="text-left">
                      <h2 className={`text-4xl font-black mb-2 ${
                        isEasyUnlocked ? "text-green-300" : "text-gray-500"
                      }`}>
                        EASY LEVEL
                      </h2>
                      <p className={`text-lg font-semibold mb-3 ${
                        isEasyUnlocked ? "text-green-100" : "text-gray-600"
                      }`}>
                        💎 +10 XP per question
                      </p>
                      {isEasyUnlocked && (
                        <>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-64 h-3 bg-black/30 rounded-full overflow-hidden border border-green-400/30">
                              <div
                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                                style={{ width: `${getProgressPercentage("easy")}%` }}
                              ></div>
                            </div>
                            <span className="text-green-300 font-bold text-sm">
                              {Math.round(getProgressPercentage("easy"))}%
                            </span>
                          </div>
                          <p className="text-green-200 text-sm font-semibold">
                            ✅ {progress?.easySolvedIndexes?.length || 0} / 100 completed
                          </p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-center">
                    {isEasyUnlocked ? (
                      <div className="bg-green-500 text-white px-6 py-3 rounded-xl font-black text-lg shadow-lg">
                        ▶ START
                      </div>
                    ) : (
                      <div className="bg-gray-600 text-gray-400 px-6 py-3 rounded-xl font-black text-lg">
                        🔒 LOCKED
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Medium Level */}
          <div className="relative group">
            <div className={`absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur ${
              isMediumUnlocked ? "opacity-50 group-hover:opacity-75" : "opacity-20"
            } transition-opacity`}></div>
            <div className="relative">
              <button
                onClick={() => isMediumUnlocked && router.push("/practise/medium")}
                disabled={!isMediumUnlocked}
                className={`w-full p-8 rounded-2xl transition-all transform ${
                  isMediumUnlocked
                    ? "bg-gradient-to-br from-yellow-800/80 to-orange-900/80 hover:scale-[1.02] cursor-pointer"
                    : "bg-gray-800/50 cursor-not-allowed"
                } backdrop-blur-xl border-2 ${
                  isMediumUnlocked ? "border-yellow-400/50" : "border-gray-600/30"
                } shadow-2xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Icon */}
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl ${
                      isMediumUnlocked
                        ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/50"
                        : "bg-gray-700"
                    } border-4 border-white/20`}>
                      {isMediumUnlocked ? "🟡" : "🔒"}
                    </div>

                    {/* Info */}
                    <div className="text-left">
                      <h2 className={`text-4xl font-black mb-2 ${
                        isMediumUnlocked ? "text-yellow-300" : "text-gray-500"
                      }`}>
                        MEDIUM LEVEL
                      </h2>
                      <p className={`text-lg font-semibold mb-3 ${
                        isMediumUnlocked ? "text-yellow-100" : "text-gray-600"
                      }`}>
                        💎 +20 XP per question
                      </p>
                      {isMediumUnlocked ? (
                        <>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-64 h-3 bg-black/30 rounded-full overflow-hidden border border-yellow-400/30">
                              <div
                                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-500"
                                style={{ width: `${getProgressPercentage("medium")}%` }}
                              ></div>
                            </div>
                            <span className="text-yellow-300 font-bold text-sm">
                              {Math.round(getProgressPercentage("medium"))}%
                            </span>
                          </div>
                          <p className="text-yellow-200 text-sm font-semibold">
                            ✅ {progress?.mediumSolvedIndexes?.length || 0} / 100 completed
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm font-semibold">
                          🔒 Complete all Easy questions to unlock
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-center">
                    {isMediumUnlocked ? (
                      <div className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-black text-lg shadow-lg">
                        ▶ START
                      </div>
                    ) : (
                      <div className="bg-gray-600 text-gray-400 px-6 py-3 rounded-xl font-black text-lg">
                        🔒 LOCKED
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Hard Level */}
          <div className="relative group">
            <div className={`absolute -inset-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl blur ${
              isHardUnlocked ? "opacity-50 group-hover:opacity-75" : "opacity-20"
            } transition-opacity`}></div>
            <div className="relative">
              <button
                onClick={() => isHardUnlocked && router.push("/practise/hard")}
                disabled={!isHardUnlocked}
                className={`w-full p-8 rounded-2xl transition-all transform ${
                  isHardUnlocked
                    ? "bg-gradient-to-br from-red-800/80 to-pink-900/80 hover:scale-[1.02] cursor-pointer"
                    : "bg-gray-800/50 cursor-not-allowed"
                } backdrop-blur-xl border-2 ${
                  isHardUnlocked ? "border-red-400/50" : "border-gray-600/30"
                } shadow-2xl`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    {/* Icon */}
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-5xl ${
                      isHardUnlocked
                        ? "bg-gradient-to-br from-red-400 to-pink-500 shadow-lg shadow-red-500/50"
                        : "bg-gray-700"
                    } border-4 border-white/20`}>
                      {isHardUnlocked ? "🔴" : "🔒"}
                    </div>

                    {/* Info */}
                    <div className="text-left">
                      <h2 className={`text-4xl font-black mb-2 ${
                        isHardUnlocked ? "text-red-300" : "text-gray-500"
                      }`}>
                        HARD LEVEL
                      </h2>
                      <p className={`text-lg font-semibold mb-3 ${
                        isHardUnlocked ? "text-red-100" : "text-gray-600"
                      }`}>
                        💎 +30 XP per question
                      </p>
                      {isHardUnlocked ? (
                        <>
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-64 h-3 bg-black/30 rounded-full overflow-hidden border border-red-400/30">
                              <div
                                className="h-full bg-gradient-to-r from-red-400 to-pink-500 transition-all duration-500"
                                style={{ width: `${getProgressPercentage("hard")}%` }}
                              ></div>
                            </div>
                            <span className="text-red-300 font-bold text-sm">
                              {Math.round(getProgressPercentage("hard"))}%
                            </span>
                          </div>
                          <p className="text-red-200 text-sm font-semibold">
                            ✅ {progress?.hardSolvedIndexes?.length || 0} / 100 completed
                          </p>
                        </>
                      ) : (
                        <p className="text-gray-500 text-sm font-semibold">
                          🔒 Complete all Medium questions to unlock
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="text-center">
                    {isHardUnlocked ? (
                      <div className="bg-red-500 text-white px-6 py-3 rounded-xl font-black text-lg shadow-lg">
                        ▶ START
                      </div>
                    ) : (
                      <div className="bg-gray-600 text-gray-400 px-6 py-3 rounded-xl font-black text-lg">
                        🔒 LOCKED
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="relative mt-12">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30"></div>
          <div className="relative bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-black text-yellow-400 mb-4 flex items-center">
              <span className="text-3xl mr-3">💡</span>
              HOW IT WORKS
            </h3>
            <div className="space-y-3 text-white">
              <div className="flex items-start space-x-3">
                <span className="text-green-400 text-xl">🟢</span>
                <p className="text-lg"><strong className="text-green-300">Easy:</strong> Start here! Perfect for beginners. Unlocked by default.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-yellow-400 text-xl">🟡</span>
                <p className="text-lg"><strong className="text-yellow-300">Medium:</strong> Unlocks after completing all Easy questions.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-400 text-xl">🔴</span>
                <p className="text-lg"><strong className="text-red-300">Hard:</strong> Unlocks after completing all Medium questions.</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-purple-400 text-xl">⚡</span>
                <p className="text-lg"><strong className="text-purple-300">Tip:</strong> Each question gives you XP based on difficulty!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
