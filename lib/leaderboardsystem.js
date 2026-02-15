"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authFeature, db } from "@/lib/firebase";
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [activeTab, setActiveTab] = useState("overall"); // overall, weekly, monthly
  const [sortBy, setSortBy] = useState("xp"); // xp, level, quizzes
  const router = useRouter();

  useEffect(() => {
    fetchLeaderboard();
  }, [sortBy, activeTab]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const user = authFeature.currentUser;
      
      // Determine the field to sort by
      let orderByField = "xp";
      if (sortBy === "level") orderByField = "level";
      if (sortBy === "quizzes") orderByField = "totalQuizzes";

      // Build query
      let q = query(
        collection(db, "users"),
        orderBy(orderByField, "desc"),
        limit(100) // Get top 100 users
      );

      // Execute query
      const snapshot = await getDocs(q);
      const users = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          email: data.email,
          level: data.level || 1,
          xp: data.xp || 0,
          title: data.title || "Novice",
          streak: data.streak || 0,
          totalQuizzes: data.totalQuizzes || 0,
          role: data.role || "student"
        });
      });

      // Filter out admins if needed (optional)
      const students = users.filter(u => u.role === "student");

      setLeaderboardData(students);

      // Find current user's rank
      if (user) {
        const userIndex = students.findIndex(u => u.id === user.uid);
        if (userIndex !== -1) {
          setCurrentUser(students[userIndex]);
          setUserRank(userIndex + 1);
        } else {
          // User not in top 100, fetch their data separately
          const userDocSnap = await getDocs(
            query(collection(db, "users"), where("__name__", "==", user.uid))
          );
          if (!userDocSnap.empty) {
            const userData = userDocSnap.docs[0].data();
            setCurrentUser({
              id: user.uid,
              email: userData.email,
              level: userData.level || 1,
              xp: userData.xp || 0,
              title: userData.title || "Novice",
              streak: userData.streak || 0,
              totalQuizzes: userData.totalQuizzes || 0
            });
            setUserRank(null); // Not in top 100
          }
        }
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getTitleColor = (title) => {
    const colors = {
      "Novice": "bg-gray-100 text-gray-700",
      "Apprentice": "bg-blue-100 text-blue-700",
      "Expert": "bg-purple-100 text-purple-700",
      "Master": "bg-yellow-100 text-yellow-700",
      "Legend": "bg-red-100 text-red-700"
    };
    return colors[title] || "bg-gray-100 text-gray-700";
  };

  const getTitleBadgeColor = (title) => {
    const colors = {
      "Novice": "bg-gray-500",
      "Apprentice": "bg-blue-500",
      "Expert": "bg-purple-500",
      "Master": "bg-yellow-500",
      "Legend": "bg-red-500"
    };
    return colors[title] || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading Leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
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
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <span className="text-5xl mr-3">🏆</span>
            Leaderboard
          </h1>
          <p className="text-lg text-gray-600">
            Compete with students across the platform
          </p>
        </div>

        {/* Current User Card (if logged in) */}
        {currentUser && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-lg flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                  {currentUser.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold">Your Rank</h3>
                  <p className="text-indigo-100">
                    {currentUser.email?.split('@')[0]}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold mb-1">
                  {userRank ? getRankIcon(userRank) : "—"}
                </div>
                <p className="text-sm text-indigo-100">
                  {userRank ? `Rank ${userRank}` : "Not in Top 100"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{currentUser.level}</div>
                <div className="text-xs text-indigo-100">Level</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{currentUser.xp}</div>
                <div className="text-xs text-indigo-100">XP</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{currentUser.streak}</div>
                <div className="text-xs text-indigo-100">Streak</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-3 text-center">
                <div className="text-2xl font-bold">{currentUser.totalQuizzes}</div>
                <div className="text-xs text-indigo-100">Quizzes</div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Sort By */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-700">Sort by:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSortBy("xp")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    sortBy === "xp"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  XP
                </button>
                <button
                  onClick={() => setSortBy("level")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    sortBy === "level"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Level
                </button>
                <button
                  onClick={() => setSortBy("quizzes")}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    sortBy === "quizzes"
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Quizzes
                </button>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchLeaderboard}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Top 3 Podium */}
          {leaderboardData.length >= 3 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8">
              <div className="flex items-end justify-center space-x-8">
                {/* 2nd Place */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg mb-2">
                    {leaderboardData[1]?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className={`${getTitleBadgeColor(leaderboardData[1]?.title)} text-white px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
                    {leaderboardData[1]?.title}
                  </div>
                  <p className="font-bold text-gray-900 text-center mb-1">
                    {leaderboardData[1]?.email?.split('@')[0]}
                  </p>
                  <div className="text-4xl mb-2">🥈</div>
                  <div className="bg-white rounded-lg px-4 py-2 shadow">
                    <p className="text-sm text-gray-600">Level {leaderboardData[1]?.level}</p>
                    <p className="text-lg font-bold text-gray-900">{leaderboardData[1]?.xp} XP</p>
                  </div>
                </div>

                {/* 1st Place */}
                <div className="flex flex-col items-center -mt-8">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-xl mb-2">
                    {leaderboardData[0]?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className={`${getTitleBadgeColor(leaderboardData[0]?.title)} text-white px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
                    {leaderboardData[0]?.title}
                  </div>
                  <p className="font-bold text-gray-900 text-center mb-1">
                    {leaderboardData[0]?.email?.split('@')[0]}
                  </p>
                  <div className="text-5xl mb-2">🥇</div>
                  <div className="bg-white rounded-lg px-6 py-3 shadow-lg">
                    <p className="text-sm text-gray-600">Level {leaderboardData[0]?.level}</p>
                    <p className="text-xl font-bold text-gray-900">{leaderboardData[0]?.xp} XP</p>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg mb-2">
                    {leaderboardData[2]?.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className={`${getTitleBadgeColor(leaderboardData[2]?.title)} text-white px-3 py-1 rounded-full text-xs font-semibold mb-2`}>
                    {leaderboardData[2]?.title}
                  </div>
                  <p className="font-bold text-gray-900 text-center mb-1">
                    {leaderboardData[2]?.email?.split('@')[0]}
                  </p>
                  <div className="text-4xl mb-2">🥉</div>
                  <div className="bg-white rounded-lg px-4 py-2 shadow">
                    <p className="text-sm text-gray-600">Level {leaderboardData[2]?.level}</p>
                    <p className="text-lg font-bold text-gray-900">{leaderboardData[2]?.xp} XP</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table Header */}
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Student</div>
              <div className="col-span-2 text-center">Level</div>
              <div className="col-span-2 text-center">XP</div>
              <div className="col-span-2 text-center">Quizzes</div>
              <div className="col-span-1 text-center">Streak</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {leaderboardData.slice(3).map((user, index) => {
              const rank = index + 4; // Starting from 4th place
              const isCurrentUser = currentUser && user.id === currentUser.id;
              
              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors ${
                    isCurrentUser ? "bg-indigo-50" : ""
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1 flex items-center">
                    <span className="text-lg font-bold text-gray-600">{rank}</span>
                  </div>

                  {/* Student Info */}
                  <div className="col-span-4 flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user.email?.split('@')[0]}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </p>
                      <p className={`text-xs px-2 py-0.5 rounded-full inline-block ${getTitleColor(user.title)}`}>
                        {user.title}
                      </p>
                    </div>
                  </div>

                  {/* Level */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-600">{user.level}</span>
                  </div>

                  {/* XP */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-900">{user.xp}</span>
                  </div>

                  {/* Quizzes */}
                  <div className="col-span-2 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">{user.totalQuizzes}</span>
                  </div>

                  {/* Streak */}
                  <div className="col-span-1 flex items-center justify-center">
                    <span className="text-lg">{user.streak > 0 ? `${user.streak}🔥` : "—"}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {leaderboardData.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 text-lg">No students on the leaderboard yet</p>
              <p className="text-gray-400 text-sm mt-2">Be the first to take a quiz!</p>
            </div>
          )}
        </div>

        {/* Stats Footer */}
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Leaderboard Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{leaderboardData.length}</div>
              <div className="text-sm text-gray-600 mt-1">Total Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {leaderboardData.length > 0 
                  ? Math.max(...leaderboardData.map(u => u.level)) 
                  : 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Highest Level</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {leaderboardData.length > 0 
                  ? leaderboardData.reduce((sum, u) => sum + u.totalQuizzes, 0)
                  : 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Quizzes Taken</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}