// leaderboardService.js - Logic and Data Fetching

import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

/**
 * Fetch leaderboard data from Firestore
 * @param {string} sortBy - Field to sort by ('xp', 'level', 'quizzes')
 * @param {number} limitCount - Maximum number of users to fetch
 * @returns {Promise<Array>} Array of user objects
 */
export const fetchLeaderboardData = async (sortBy = "xp", limitCount = 100) => {
  try {
    // Determine the field to sort by
    let orderByField = "xp";
    if (sortBy === "level") orderByField = "level";
    if (sortBy === "quizzes") orderByField = "totalQuizzes";

    // Build query
    const q = query(
      collection(db, "users"),
      orderBy(orderByField, "desc"),
      limit(limitCount)
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

    // Filter out admins (only show students)
    const students = users.filter(u => u.role === "student");

    return students;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
};

/**
 * Fetch current user's data
 * @param {string} userId - Current user's ID
 * @returns {Promise<Object|null>} User object or null
 */
export const fetchCurrentUserData = async (userId) => {
  try {
    const q = query(
      collection(db, "users"),
      where("__name__", "==", userId)
    );
    
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data();
      return {
        id: userId,
        email: userData.email,
        level: userData.level || 1,
        xp: userData.xp || 0,
        title: userData.title || "Novice",
        streak: userData.streak || 0,
        totalQuizzes: userData.totalQuizzes || 0,
        role: userData.role || "student"
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching current user data:", error);
    throw error;
  }
};

/**
 * Find user's rank in the leaderboard
 * @param {Array} leaderboardData - Array of users
 * @param {string} userId - Current user's ID
 * @returns {number|null} Rank position or null if not found
 */
export const findUserRank = (leaderboardData, userId) => {
  const userIndex = leaderboardData.findIndex(u => u.id === userId);
  return userIndex !== -1 ? userIndex + 1 : null;
};

/**
 * Get rank icon/emoji for display
 * @param {number} rank - Rank position
 * @returns {string} Emoji or formatted rank string
 */
export const getRankIcon = (rank) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return `#${rank}`;
};

/**
 * Get title color classes for badges
 * @param {string} title - User title
 * @returns {string} Tailwind CSS classes
 */
export const getTitleColor = (title) => {
  const colors = {
    "Novice": "bg-gray-100 text-gray-700",
    "Apprentice": "bg-blue-100 text-blue-700",
    "Expert": "bg-purple-100 text-purple-700",
    "Master": "bg-yellow-100 text-yellow-700",
    "Legend": "bg-red-100 text-red-700"
  };
  return colors[title] || "bg-gray-100 text-gray-700";
};

/**
 * Get title badge background color
 * @param {string} title - User title
 * @returns {string} Tailwind CSS class
 */
export const getTitleBadgeColor = (title) => {
  const colors = {
    "Novice": "bg-gray-500",
    "Apprentice": "bg-blue-500",
    "Expert": "bg-purple-500",
    "Master": "bg-yellow-500",
    "Legend": "bg-red-500"
  };
  return colors[title] || "bg-gray-500";
};

/**
 * Calculate leaderboard statistics
 * @param {Array} leaderboardData - Array of users
 * @returns {Object} Statistics object
 */
export const calculateLeaderboardStats = (leaderboardData) => {
  if (leaderboardData.length === 0) {
    return {
      totalStudents: 0,
      highestLevel: 0,
      totalQuizzes: 0
    };
  }

  return {
    totalStudents: leaderboardData.length,
    highestLevel: Math.max(...leaderboardData.map(u => u.level)),
    totalQuizzes: leaderboardData.reduce((sum, u) => sum + u.totalQuizzes, 0)
  };
};

/**
 * Get top 3 users for podium display
 * @param {Array} leaderboardData - Array of users
 * @returns {Array} Array of top 3 users
 */
export const getTop3Users = (leaderboardData) => {
  return leaderboardData.slice(0, 3);
};

/**
 * Get remaining users (after top 3)
 * @param {Array} leaderboardData - Array of users
 * @returns {Array} Array of users from rank 4 onwards
 */
export const getRemainingUsers = (leaderboardData) => {
  return leaderboardData.slice(3);
};