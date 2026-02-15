// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { authFeature } from "@/lib/firebase";
// import {
//   fetchLeaderboardData,
//   fetchCurrentUserData,
//   findUserRank,
//   getRankIcon,
//   getTitleColor,
//   getTitleBadgeColor,
//   calculateLeaderboardStats,
//   getTop3Users,
//   getRemainingUsers
// } from "@/lib/leaderboardsystem";

// export default function Leaderboard() {
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [userRank, setUserRank] = useState(null);
//   const [sortBy, setSortBy] = useState("xp"); // xp, level, quizzes
//   const [stats, setStats] = useState({
//     totalStudents: 0,
//     highestLevel: 0,
//     totalQuizzes: 0
//   });
//   const router = useRouter();

//   useEffect(() => {
//     loadLeaderboard();
//   }, [sortBy]);

//   const loadLeaderboard = async () => {
//     setLoading(true);
//     try {
//       const user = authFeature.currentUser;

//       // Fetch leaderboard data
//       const data = await fetchLeaderboardData(sortBy, 100);
//       setLeaderboardData(data);

//       // Calculate stats
//       const leaderboardStats = calculateLeaderboardStats(data);
//       setStats(leaderboardStats);

//       // Find current user's rank and data
//       if (user) {
//         const rank = findUserRank(data, user.uid);
//         setUserRank(rank);

//         if (rank) {
//           // User is in top 100
//           setCurrentUser(data[rank - 1]);
//         } else {
//           // User not in top 100, fetch their data separately
//           const userData = await fetchCurrentUserData(user.uid);
//           setCurrentUser(userData);
//         }
//       }
//     } catch (error) {
//       console.error("Error loading leaderboard:", error);
//       alert("Failed to load leaderboard. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = () => {
//     loadLeaderboard();
//   };

//   const handleSortChange = (newSortBy) => {
//     setSortBy(newSortBy);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 font-semibold">Loading Leaderboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const top3Users = getTop3Users(leaderboardData);
//   const remainingUsers = getRemainingUsers(leaderboardData);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
//           >
//             <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Dashboard
//           </button>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Page Title */}
//         <div className="text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
//             <span className="text-5xl mr-3">🏆</span>
//             Leaderboard
//           </h1>
//           <p className="text-lg text-gray-600">
//             Compete with students across the platform
//           </p>
//         </div>

//         {/* Current User Card */}
//         {currentUser && (
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-2xl font-bold border-2 border-white/30">
//                   {currentUser.email?.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-bold">Your Rank</h3>
//                   <p className="text-indigo-100">
//                     {currentUser.email?.split('@')[0]}
//                   </p>
//                 </div>
//               </div>
//               <div className="text-right">
//                 <div className="text-4xl font-bold mb-1">
//                   {userRank ? getRankIcon(userRank) : "—"}
//                 </div>
//                 <p className="text-sm text-indigo-100">
//                   {userRank ? `Rank ${userRank}` : "Not in Top 100"}
//                 </p>
//               </div>
//             </div>
//             <div className="grid grid-cols-4 gap-4 mt-6">
//               <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 text-center">
//                 <div className="text-2xl font-bold">{currentUser.level}</div>
//                 <div className="text-xs text-indigo-100">Level</div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 text-center">
//                 <div className="text-2xl font-bold">{currentUser.xp}</div>
//                 <div className="text-xs text-indigo-100">XP</div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 text-center">
//                 <div className="text-2xl font-bold">{currentUser.streak}</div>
//                 <div className="text-xs text-indigo-100">Streak</div>
//               </div>
//               <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 text-center">
//                 <div className="text-2xl font-bold">{currentUser.totalQuizzes}</div>
//                 <div className="text-xs text-indigo-100">Quizzes</div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Filters */}
//         <div className="bg-white rounded-xl shadow-md p-4 mb-6">
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//             {/* Sort By */}
//             <div className="flex items-center space-x-2">
//               <span className="text-sm font-semibold text-gray-700">Sort by:</span>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handleSortChange("xp")}
//                   className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
//                     sortBy === "xp"
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   XP
//                 </button>
//                 <button
//                   onClick={() => handleSortChange("level")}
//                   className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
//                     sortBy === "level"
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Level
//                 </button>
//                 <button
//                   onClick={() => handleSortChange("quizzes")}
//                   className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
//                     sortBy === "quizzes"
//                       ? "bg-indigo-600 text-white"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   Quizzes
//                 </button>
//               </div>
//             </div>

//             {/* Refresh Button */}
//             <button
//               onClick={handleRefresh}
//               className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//               </svg>
//               <span>Refresh</span>
//             </button>
//           </div>
//         </div>

//         {/* Leaderboard Table */}
//         <div className="bg-white rounded-xl shadow-xl overflow-hidden">
//           {/* Top 3 Podium */}
//           {top3Users.length >= 3 && (
//             <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8">
//               <div className="flex items-end justify-center space-x-8">
//                 {/* 2nd Place */}
//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg mb-2">
//                     {top3Users[1]?.email?.charAt(0).toUpperCase()}
//                   </div>
//                   <div className={`${getTitleBadgeColor(top3Users[1]?.title)} text-white px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
//                     {top3Users[1]?.title}
//                   </div>
//                   <p className="font-bold text-gray-900 text-center mb-1">
//                     {top3Users[1]?.email?.split('@')[0]}
//                   </p>
//                   <div className="text-4xl mb-2">🥈</div>
//                   <div className="bg-white rounded-lg px-4 py-2 shadow">
//                     <p className="text-sm text-gray-600">Level {top3Users[1]?.level}</p>
//                     <p className="text-lg font-bold text-gray-900">{top3Users[1]?.xp} XP</p>
//                   </div>
//                 </div>

//                 {/* 1st Place */}
//                 <div className="flex flex-col items-center -mt-8">
//                   <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-xl mb-2">
//                     {top3Users[0]?.email?.charAt(0).toUpperCase()}
//                   </div>
//                   <div className={`${getTitleBadgeColor(top3Users[0]?.title)} text-white px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
//                     {top3Users[0]?.title}
//                   </div>
//                   <p className="font-bold text-gray-900 text-center mb-1">
//                     {top3Users[0]?.email?.split('@')[0]}
//                   </p>
//                   <div className="text-5xl mb-2">🥇</div>
//                   <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
//                     <p className="text-sm text-gray-600">Level {top3Users[0]?.level}</p>
//                     <p className="text-xl font-bold text-gray-900">{top3Users[0]?.xp} XP</p>
//                   </div>
//                 </div>

//                 {/* 3rd Place */}
//                 <div className="flex flex-col items-center">
//                   <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg mb-2">
//                     {top3Users[2]?.email?.charAt(0).toUpperCase()}
//                   </div>
//                   <div className={`${getTitleBadgeColor(top3Users[2]?.title)} text-white px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
//                     {top3Users[2]?.title}
//                   </div>
//                   <p className="font-bold text-gray-900 text-center mb-1">
//                     {top3Users[2]?.email?.split('@')[0]}
//                   </p>
//                   <div className="text-4xl mb-2">🥉</div>
//                   <div className="bg-white rounded-lg px-4 py-2 shadow">
//                     <p className="text-sm text-gray-600">Level {top3Users[2]?.level}</p>
//                     <p className="text-lg font-bold text-gray-900">{top3Users[2]?.xp} XP</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Table Header */}
//           <div className="bg-gray-50 border-b border-gray-200">
//             <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
//               <div className="col-span-1">Rank</div>
//               <div className="col-span-4">Student</div>
//               <div className="col-span-2 text-center">Level</div>
//               <div className="col-span-2 text-center">XP</div>
//               <div className="col-span-2 text-center">Quizzes</div>
//               <div className="col-span-1 text-center">Streak</div>
//             </div>
//           </div>

//           {/* Table Body */}
//           <div className="divide-y divide-gray-200">
//             {remainingUsers.map((user, index) => {
//               const rank = index + 4; // Starting from 4th place
//               const isCurrentUser = currentUser && user.id === currentUser.id;
              
//               return (
//                 <div
//                   key={user.id}
//                   className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
//                     isCurrentUser ? "bg-indigo-50" : ""
//                   }`}
//                 >
//                   {/* Rank */}
//                   <div className="col-span-1 flex items-center">
//                     <span className="text-lg font-bold text-gray-600">{rank}</span>
//                   </div>

//                   {/* Student Info */}
//                   <div className="col-span-4 flex items-center space-x-3">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
//                       {user.email?.charAt(0).toUpperCase()}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-gray-900">
//                         {user.email?.split('@')[0]}
//                         {isCurrentUser && (
//                           <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
//                             You
//                           </span>
//                         )}
//                       </p>
//                       <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${getTitleColor(user.title)}`}>
//                         {user.title}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Level */}
//                   <div className="col-span-2 flex items-center justify-center">
//                     <span className="text-lg font-bold text-indigo-600">{user.level}</span>
//                   </div>

//                   {/* XP */}
//                   <div className="col-span-2 flex items-center justify-center">
//                     <span className="text-lg font-bold text-gray-900">{user.xp}</span>
//                   </div>

//                   {/* Quizzes */}
//                   <div className="col-span-2 flex items-center justify-center">
//                     <span className="text-lg font-semibold text-gray-700">{user.totalQuizzes}</span>
//                   </div>

//                   {/* Streak */}
//                   <div className="col-span-1 flex items-center justify-center">
//                     <span className="text-lg">{user.streak > 0 ? `${user.streak}🔥` : "—"}</span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Empty State */}
//           {leaderboardData.length === 0 && (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//               </svg>
//               <p className="text-gray-500 text-lg">No students on the leaderboard yet</p>
//               <p className="text-gray-400 text-sm mt-2">Be the first to take a quiz!</p>
//             </div>
//           )}
//         </div>

//         {/* Stats Footer */}
//         <div className="mt-8 bg-white rounded-xl shadow-md p-6">
//           <h3 className="text-lg font-bold text-gray-900 mb-4">Leaderboard Stats</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-indigo-600">{stats.totalStudents}</div>
//               <div className="text-sm text-gray-600 mt-1">Total Students</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-purple-600">{stats.highestLevel}</div>
//               <div className="text-sm text-gray-600 mt-1">Highest Level</div>
//             </div>
//             <div className="text-center">
//               <div className="text-3xl font-bold text-yellow-600">{stats.totalQuizzes}</div>
//               <div className="text-sm text-gray-600 mt-1">Total Quizzes Taken</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFeature } from "@/lib/firebase";
import {
  fetchLeaderboardData,
  fetchCurrentUserData,
  findUserRank,
  getRankIcon,
  getTitleColor,
  getTitleBadgeColor,
  calculateLeaderboardStats,
  getTop3Users,
  getRemainingUsers
} from "@/lib/leaderboardsystem";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [sortBy, setSortBy] = useState("xp");
  const [stats, setStats] = useState({
    totalStudents: 0,
    highestLevel: 0,
    totalQuizzes: 0
  });
  const router = useRouter();

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const user = authFeature.currentUser;
      const data = await fetchLeaderboardData(sortBy, 100);
      setLeaderboardData(data);

      const leaderboardStats = calculateLeaderboardStats(data);
      setStats(leaderboardStats);

      if (user) {
        const rank = findUserRank(data, user.uid);
        setUserRank(rank);

        if (rank) {
          setCurrentUser(data[rank - 1]);
        } else {
          const userData = await fetchCurrentUserData(user.uid);
          setCurrentUser(userData);
        }
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      alert("Failed to load leaderboard. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadLeaderboard();
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-yellow-400 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">🏆</span>
            </div>
          </div>
          <p className="text-white font-bold text-xl mt-6">Loading Leaderboard...</p>
          <div className="flex items-center justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    );
  }

  const top3Users = getTop3Users(leaderboardData);
  const remainingUsers = getRemainingUsers(leaderboardData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
   
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        
      </div>

    
      <div className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white hover:text-yellow-400 transition-colors group"
          >
            <svg className="w-6 h-6 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-bold">Back to Dashboard</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
       
        <div className="text-center mb-12">
          <div className="inline-block">
            <div className="relative">
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-4 ">
                🏆 LEADERBOARD 🏆
              </h1>
             
            </div>
          </div>
          <p className="text-xl text-yellow-200 font-semibold mt-4">
         Rise to the top and claim your glory!
          </p>
        </div>

        {currentUser && (
          <div className="relative mb-10">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl blur opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-purple-800/90 to-indigo-900/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border-2 border-yellow-400/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur opacity-50 animate-pulse"></div>
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl font-black border-4 border-white shadow-2xl transform hover:scale-110 transition-transform">
                      {currentUser.email?.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-2 -right-2 ${getTitleBadgeColor(currentUser.title)} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg border-2 border-white`}>
                      {currentUser.title}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white ml-175 mb-2">YOUR RANK :</h3>
                    <p className="text-yellow-300 text-xl font-semibold">
                      {currentUser.email?.split('@')[0]}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-7xl font-black mb-2 transform hover:scale-110 transition-transform">
                    {userRank ? getRankIcon(userRank) : "🎯"}
                  </div>
                  <p className="text-yellow-300 text-lg font-bold">
                    {userRank ? `${userRank} GLOBALLY` : "UNRANKED"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <div className="bg-gradient-to-br from-blue-600/50 to-blue-800/50 backdrop-blur-lg rounded-xl p-4 text-center border border-blue-400/30 transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-white">{currentUser.level}</div>
                  <div className="text-blue-200 text-sm font-semibold mt-1">LEVEL</div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/50 to-purple-800/50 backdrop-blur-lg rounded-xl p-4 text-center border border-purple-400/30 transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-white">{currentUser.xp}</div>
                  <div className="text-purple-200 text-sm font-semibold mt-1">XP</div>
                </div>
                <div className="bg-gradient-to-br from-red-600/50 to-red-800/50 backdrop-blur-lg rounded-xl p-4 text-center border border-red-400/30 transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-white flex items-center justify-center">
                    {currentUser.streak} 🔥
                  </div>
                  <div className="text-red-200 text-sm font-semibold mt-1">STREAK</div>
                </div>
                <div className="bg-gradient-to-br from-green-600/50 to-green-800/50 backdrop-blur-lg rounded-xl p-4 text-center border border-green-400/30 transform hover:scale-105 transition-transform">
                  <div className="text-4xl font-black text-white">{currentUser.totalQuizzes}</div>
                  <div className="text-green-200 text-sm font-semibold mt-1">QUIZZES</div>
                </div>
              </div>
            </div>
          </div>
        )}

       
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30"></div>
          <div className="relative bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl p-6 border border-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-white font-bold text-lg">⚡ SORT BY:</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSortChange("xp")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      sortBy === "xp"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-500/50"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    💎 XP
                  </button>
                  <button
                    onClick={() => handleSortChange("level")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      sortBy === "level"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-500/50"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    🎯 LEVEL
                  </button>
                  <button
                    onClick={() => handleSortChange("quizzes")}
                    className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 ${
                      sortBy === "quizzes"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-500/50"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    📝 QUIZZES
                  </button>
                </div>
              </div>
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>REFRESH</span>
              </button>
            </div>
          </div>
        </div>

      
        {top3Users.length >= 3 && (
          <div className="relative mb-12">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl blur opacity-20 "></div>
            <div className="relative bg-gradient-to-br from-yellow-900/40 to-orange-900/40 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border-2 border-yellow-400/30">
              <h2 className="text-4xl font-black text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 mb-8">
                ⭐ TOP CHAMPIONS ⭐
              </h2>
              <div className="flex items-end justify-center space-x-8">
             
                <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
                  <div className="relative mb-4">
                    <div className="absolute -inset-2 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full blur opacity-50 animate-pulse"></div>
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center text-3xl font-black border-4 border-white shadow-2xl">
                      {top3Users[1]?.email?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className={`${getTitleBadgeColor(top3Users[1]?.title)} text-white px-4 py-1 rounded-full text-xs font-bold mb-2 shadow-lg`}>
                    {top3Users[1]?.title}
                  </div>
                  <p className="font-black text-white text-lg mb-2 text-center">
                    {top3Users[1]?.email?.split('@')[0]}
                  </p>
                  <div className="text-6xl mb-3 animate-bounce">🥈</div>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-300 rounded-xl px-6 py-4 shadow-xl border-2 border-gray-400">
                    <p className="text-sm text-gray-700 font-bold">Level {top3Users[1]?.level}</p>
                    <p className="text-2xl font-black text-gray-900">{top3Users[1]?.xp} XP</p>
                  </div>
                </div>

              
                <div className="flex flex-col items-center transform hover:scale-110 transition-transform -mt-12">
                  <div className="text-6xl mb-2 animate-bounce">👑</div>
                  <div className="relative mb-4">
                    <div className="absolute -inset-3 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full blur opacity-75 animate-pulse"></div>
                    <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 flex items-center justify-center text-5xl font-black border-4 border-white shadow-2xl">
                      {top3Users[0]?.email?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className={`${getTitleBadgeColor(top3Users[0]?.title)} text-white px-5 py-2 rounded-full text-sm font-bold mb-3 shadow-lg`}>
                    {top3Users[0]?.title}
                  </div>
                  <p className="font-black text-white text-2xl mb-3 text-center">
                    {top3Users[0]?.email?.split('@')[0]}
                  </p>
                  <div className="text-7xl mb-4 animate-bounce">🥇</div>
                  <div className="bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-xl px-8 py-5 shadow-2xl border-4 border-yellow-500">
                    <p className="text-sm text-yellow-800 font-bold">Level {top3Users[0]?.level}</p>
                    <p className="text-3xl font-black text-yellow-900">{top3Users[0]?.xp} XP</p>
                  </div>
                </div>

              
                <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
                  <div className="relative mb-4">
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full blur opacity-50 animate-pulse"></div>
                    <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-3xl font-black border-4 border-white shadow-2xl">
                      {top3Users[2]?.email?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className={`${getTitleBadgeColor(top3Users[2]?.title)} text-white px-4 py-1 rounded-full text-xs font-bold mb-2 shadow-lg`}>
                    {top3Users[2]?.title}
                  </div>
                  <p className="font-black text-white text-lg mb-2 text-center">
                    {top3Users[2]?.email?.split('@')[0]}
                  </p>
                  <div className="text-6xl mb-3 animate-bounce">🥉</div>
                  <div className="bg-gradient-to-br from-orange-200 to-orange-400 rounded-xl px-6 py-4 shadow-xl border-2 border-orange-500">
                    <p className="text-sm text-orange-800 font-bold">Level {top3Users[2]?.level}</p>
                    <p className="text-2xl font-black text-orange-900">{top3Users[2]?.xp} XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

       
        <div className="space-y-3">
          {remainingUsers.map((user, index) => {
            const rank = index + 4;
            const isCurrentUser = currentUser && user.id === currentUser.id;
            
            return (
              <div
                key={user.id}
                className="relative group"
              >
                <div className={`absolute -inset-1 bg-gradient-to-r ${
                  isCurrentUser 
                    ? "from-yellow-400 to-orange-500 opacity-50" 
                    : "from-blue-500 to-purple-500 opacity-0 group-hover:opacity-30"
                } rounded-xl blur transition-opacity`}></div>
                <div className={`relative ${
                  isCurrentUser 
                    ? "bg-gradient-to-r from-yellow-900/60 to-orange-900/60 border-2 border-yellow-400" 
                    : "bg-black/30 border border-white/10 hover:bg-black/40"
                } backdrop-blur-xl rounded-xl shadow-lg p-5 transition-all transform hover:scale-[1.02]`}>
                  <div className="flex items-center justify-between">
                    {/* Rank & Avatar */}
                    <div className="flex items-center space-x-5 flex-1">
                      <div className="text-3xl font-black text-yellow-400 w-12 text-center">
                        {rank}
                      </div>
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-lg">
                          {user.email?.charAt(0).toUpperCase()}
                        </div>
                        {isCurrentUser && (
                          <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs font-black px-2 py-1 rounded-full border-2 border-white">
                            YOU
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-black text-white text-lg">
                          {user.email?.split('@')[0]}
                        </p>
                        <p className={`text-xs px-3 py-1 rounded-full inline-block ${getTitleColor(user.title)} font-bold mt-1`}>
                          {user.title}
                        </p>
                      </div>
                    </div>

                   
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-black text-blue-400">{user.level}</div>
                        <div className="text-xs text-blue-200 font-semibold">LEVEL</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-purple-400">{user.xp}</div>
                        <div className="text-xs text-purple-200 font-semibold">XP</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black text-green-400">{user.totalQuizzes}</div>
                        <div className="text-xs text-green-200 font-semibold">QUIZZES</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-black">
                          {user.streak > 0 ? `${user.streak}🔥` : "—"}
                        </div>
                        <div className="text-xs text-red-200 font-semibold">STREAK</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

       
        {leaderboardData.length === 0 && (
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-black/30 backdrop-blur-xl rounded-2xl p-16 text-center border border-white/10">
              <div className="text-8xl mb-6">🏆</div>
              <p className="text-white text-2xl font-bold mb-2">No Champions Yet!</p>
              <p className="text-gray-400 text-lg">Be the first to conquer the leaderboard!</p>
            </div>
          </div>
        )}

      
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-xl rounded-xl shadow-xl p-8 text-center border border-blue-400/30 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                {stats.totalStudents}
              </div>
              <div className="text-blue-200 text-lg font-bold mt-2">TOTAL WARRIORS</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-purple-900/60 to-pink-900/60 backdrop-blur-xl rounded-xl shadow-xl p-8 text-center border border-purple-400/30 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                {stats.highestLevel}
              </div>
              <div className="text-purple-200 text-lg font-bold mt-2">HIGHEST LEVEL</div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-yellow-900/60 to-orange-900/60 backdrop-blur-xl rounded-xl shadow-xl p-8 text-center border border-yellow-400/30 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                {stats.totalQuizzes}
              </div>
              <div className="text-yellow-200 text-lg font-bold mt-2">QUIZZES CONQUERED</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}