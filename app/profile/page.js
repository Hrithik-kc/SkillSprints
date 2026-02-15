// "use client";

// import { useEffect, useState } from "react";
// import { authFeature, db } from "@/lib/firebase";
// import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
// import { useRouter } from "next/navigation";

// export default function Profile() {
//   const [userData, setUserData] = useState(null);
//   const [quizCount, setQuizCount] = useState(0);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const user = authFeature.currentUser;
//       if (!user) return;

//       const docSnap = await getDoc(doc(db, "users", user.uid));
//       setUserData(docSnap.data());

//       const q = query(collection(db, "quizResults"), where("userId", "==", user.uid));
//       const snapshot = await getDocs(q);
//       setQuizCount(snapshot.size);
//     };

//     fetchProfile();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <button onClick={() => router.back()}>⬅ Back</button>

//       <h2>Profile</h2>
//       <p>Email: {userData?.email}</p>
//       <p>Level: {userData?.level}</p>
//       <p>Title: {userData?.title}</p>
//       <p>XP: {userData?.xp}</p>
//       <p>Quizzes Attempted: {quizCount}</p>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [quizCount, setQuizCount] = useState(0);
  const [stats, setStats] = useState({
    totalScore: 0,
    averageScore: 0,
    bestScore: 0,
    streak: 0,
    recentQuizzes: []
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const user = authFeature.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      try {
       
        const docSnap = await getDoc(doc(db, "users", user.uid));
        setUserData(docSnap.data());

        const q = query(
          collection(db, "quizResults"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const snapshot = await getDocs(q);
        setQuizCount(snapshot.size);

       
        let totalScore = 0;
        let bestScore = 0;
        const recentQuizzes = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          const score = data.score || 0;
          totalScore += score;
          if (score > bestScore) bestScore = score;
          recentQuizzes.push({
            id: doc.id,
            score: score,
            date: data.timestamp?.toDate() || new Date(),
            type: data.quizType || "Practice"
          });
        });

        setStats({
          totalScore,
          averageScore: snapshot.size > 0 ? Math.round(totalScore / snapshot.size) : 0,
          bestScore,
          streak: docSnap.data()?.streak || 0,
          recentQuizzes
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const getLevelProgress = () => {
    const currentLevel = userData?.level || 1;
    const xp = userData?.xp || 0;
    const xpForNextLevel = currentLevel * 100;
    return (xp % 100) / xpForNextLevel * 100;
  };

  const getTitleBadgeColor = (title) => {
    const titleColors = {
      "Novice": "bg-gray-500",
      "Apprentice": "bg-blue-500",
      "Expert": "bg-purple-500",
      "Master": "bg-yellow-500",
      "Legend": "bg-red-500"
    };
    return titleColors[title] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50">
   
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
          
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-5xl font-bold border-4 border-white/30">
                {userData?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className={`absolute -bottom-2 -right-2 ${getTitleBadgeColor(userData?.title)} rounded-full px-3 py-1 text-xs font-semibold shadow-lg`}>
                {userData?.title || "Novice"}
              </div>
            </div>

          
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{userData?.email?.split('@')[0] || "Student"}</h1>
              <p className="text-indigo-100 mb-4">{userData?.email}</p>
              
            
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2">
                  <div className="text-xs text-indigo-100">Level</div>
                  <div className="text-2xl font-bold">{userData?.level || 1}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2">
                  <div className="text-xs text-indigo-100">Total XP</div>
                  <div className="text-2xl font-bold">{userData?.xp || 0}</div>
                </div>
                <div className="bg-white/20 backdrop-blur-lg rounded-lg px-4 py-2">
                  <div className="text-xs text-indigo-100">Streak</div>
                  <div className="text-2xl font-bold flex items-center">
                    {stats.streak} 🔥
                  </div>
                </div>
              </div>

            
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress to Level {(userData?.level || 1) + 1}</span>
                  <span>{userData?.xp % 100 || 0} / {(userData?.level || 1) * 100} XP</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div
                    className="bg-yellow-400 h-3 rounded-full transition-all duration-500 shadow-lg"
                    style={{ width: `${getLevelProgress()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Quizzes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{quizCount}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

        
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageScore}%</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Best Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bestScore}%</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

    
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Current Streak</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.streak} days</p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <span className="text-3xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

       
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h2>
          
          {stats.recentQuizzes.length > 0 ? (
            <div className="space-y-3">
              {stats.recentQuizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-indigo-100 rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-indigo-600 font-bold">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{quiz.type} Quiz</p>
                      <p className="text-sm text-gray-500">
                        {quiz.date.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full font-semibold ${
                    quiz.score >= 80 ? 'bg-green-100 text-green-700' :
                    quiz.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {quiz.score}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No quiz attempts yet</p>
              <button
                onClick={() => router.push('/Quiz')}
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Start Your First Quiz
              </button>
            </div>
          )}
        </div>

       
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/practise')}
            className="flex-1 bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Continue Practice
          </button>
          <button
            onClick={() => router.push('/compete')}
            className="flex-1 bg-purple-600 text-white py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Join Competition
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="flex-1 bg-yellow-500 text-white py-4 rounded-xl font-semibold hover:bg-yellow-600 transition-colors shadow-lg hover:shadow-xl"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
}
