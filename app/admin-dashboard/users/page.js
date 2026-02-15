// "use client";
// import { useEffect, useState } from "react";
// import { authFeature, db } from "@/lib/firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { useRouter } from "next/navigation";

// export default function AdminUsers() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const user = authFeature.currentUser;
//     if (!user) {
//       router.push("/login");
//       return;
//     }

//     const fetchUsers = async () => {
//       const qSnap = await getDocs(collection(db, "users"));
//       setUsers(qSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
//       setLoading(false);
//     };

//     fetchUsers();
//   }, []);

//   return (
//     <div className="min-h-screen p-8 bg-black/20 text-white">
//       <div className="max-w-4xl mx-auto bg-white/5 p-6 rounded-2xl">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-xl font-semibold">Registered Users</h3>
//           <button onClick={() => router.push('/admin-dashboard')} className="bg-indigo-600 px-3 py-1 rounded">Back</button>
//         </div>

//         {loading && <p className="text-gray-300">Loading...</p>}

//         {!loading && (
//           <table className="w-full text-sm text-left">
//             <thead className="text-gray-300">
//               <tr>
//                 <th className="py-2">Email</th>
//                 <th className="py-2">Role</th>
//                 <th className="py-2">XP</th>
//               </tr>
//             </thead>
//             <tbody>
//               {users.map((u) => (
//                 <tr key={u.id} className="border-t border-white/10">
//                   <td className="py-2">{u.email}</td>
//                   <td className="py-2">{u.role}</td>
//                   <td className="py-2">{u.xp ?? u.leaderboardPoints ?? 0}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [sortBy, setSortBy] = useState("xp");
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    admins: 0,
    totalXP: 0
  });
  const router = useRouter();

  useEffect(() => {
    const user = authFeature.currentUser;
    if (!user) {
      router.push("/login");
      return;
    }

    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const qSnap = await getDocs(collection(db, "users"));
      const userData = qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(userData);

      // Calculate stats
      const totalXP = userData.reduce((sum, u) => sum + (u.xp || 0), 0);
      const students = userData.filter(u => u.role === "student").length;
      const admins = userData.filter(u => u.role === "admin").length;

      setStats({
        totalUsers: userData.length,
        students,
        admins,
        totalXP
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
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

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return "bg-gradient-to-r from-red-500 to-pink-500 text-white";
    }
    return "bg-gradient-to-r from-blue-500 to-cyan-500 text-white";
  };

  const filteredUsers = users
    .filter(user => {
      const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === "xp") return (b.xp || 0) - (a.xp || 0);
      if (sortBy === "level") return (b.level || 0) - (a.level || 0);
      if (sortBy === "email") return (a.email || "").localeCompare(b.email || "");
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-yellow-400 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl">👥</span>
            </div>
          </div>
          <p className="text-white font-bold text-xl mt-6">Loading Users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute -bottom-32 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/admin-dashboard')}
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
        {/* Page Title */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <div className="relative">
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4 animate-pulse">
                User Details
              </h1>
             
            </div>
          </div>
          <p className="text-xl text-blue-200 font-semibold mt-4">
            ⚡ Manage all registered users ⚡
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-blue-900/60 to-cyan-900/60 backdrop-blur-xl rounded-xl shadow-xl p-6 text-center border border-blue-400/30">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
                {stats.totalUsers}
              </div>
              <div className="text-blue-200 text-sm font-bold mt-2">TOTAL USERS</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-green-900/60 to-emerald-900/60 backdrop-blur-xl rounded-xl shadow-xl p-6 text-center border border-green-400/30">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-300">
                {stats.students}
              </div>
              <div className="text-green-200 text-sm font-bold mt-2">STUDENTS</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-red-900/60 to-pink-900/60 backdrop-blur-xl rounded-xl shadow-xl p-6 text-center border border-red-400/30">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-300 to-pink-300">
                {stats.admins}
              </div>
              <div className="text-red-200 text-sm font-bold mt-2">ADMINS</div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-gradient-to-br from-purple-900/60 to-violet-900/60 backdrop-blur-xl rounded-xl shadow-xl p-6 text-center border border-purple-400/30">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-violet-300">
                {stats.totalXP.toLocaleString()}
              </div>
              <div className="text-purple-200 text-sm font-bold mt-2">TOTAL XP</div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-30"></div>
          <div className="relative bg-black/40 backdrop-blur-xl rounded-xl shadow-2xl p-6 border border-white/10">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="🔍 Search by email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Filter by Role */}
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-sm">FILTER:</span>
                <button
                  onClick={() => setFilterRole("all")}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filterRole === "all"
                      ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  ALL
                </button>
                <button
                  onClick={() => setFilterRole("student")}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filterRole === "student"
                      ? "bg-gradient-to-r from-blue-400 to-cyan-500 text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  👨‍🎓 STUDENTS
                </button>
                <button
                  onClick={() => setFilterRole("admin")}
                  className={`px-4 py-3 rounded-xl font-bold transition-all ${
                    filterRole === "admin"
                      ? "bg-gradient-to-r from-red-400 to-pink-500 text-black"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  👨‍💼 ADMINS
                </button>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-sm">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="xp">💎 XP</option>
                  <option value="level">🎯 Level</option>
                  <option value="email">📧 Email</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Users List */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20"></div>
          <div className="relative bg-black/30 backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden border border-white/10">
            {/* Table Header */}
            <div className="bg-black/40 border-b border-white/10">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-bold text-yellow-300">
                <div className="col-span-1">#</div>
                <div className="col-span-4">USER</div>
                <div className="col-span-2 text-center">ROLE</div>
                <div className="col-span-2 text-center">LEVEL</div>
                <div className="col-span-2 text-center">XP</div>
                <div className="col-span-1 text-center">STREAK</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/10 max-h-[600px] overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-white text-xl font-bold">No users found</p>
                  <p className="text-gray-400 mt-2">Try adjusting your filters</p>
                </div>
              ) : (
                filteredUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-white/5 transition-colors group"
                  >
                    {/* Index */}
                    <div className="col-span-1 flex items-center">
                      <span className="text-lg font-bold text-gray-400 group-hover:text-yellow-400 transition-colors">
                        {index + 1}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="col-span-4 flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg border-2 border-white/20 shadow-lg">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-yellow-400 transition-colors">
                          {user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className={`${getRoleBadge(user.role)} px-4 py-2 rounded-full text-xs font-bold uppercase shadow-lg`}>
                        {user.role === "admin" ? "👨‍💼 Admin" : "👨‍🎓 Student"}
                      </span>
                    </div>

                    {/* Level */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-black text-blue-400">{user.level || 1}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${getTitleBadgeColor(user.title)} text-white font-bold mt-1`}>
                          {user.title || "Novice"}
                        </div>
                      </div>
                    </div>

                    {/* XP */}
                    <div className="col-span-2 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-black text-purple-400">
                          {user.xp || 0}
                        </div>
                        <div className="text-xs text-purple-200 font-semibold">XP</div>
                      </div>
                    </div>

                    {/* Streak */}
                    <div className="col-span-1 flex items-center justify-center">
                      <span className="text-xl">
                        {user.streak > 0 ? `${user.streak}🔥` : "—"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="bg-black/40 border-t border-white/10 px-6 py-4">
              <p className="text-center text-gray-400 text-sm font-semibold">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={fetchUsers}
            className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>REFRESH DATA</span>
          </button>

          <button
            onClick={() => router.push('/admin-dashboard')}
            className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-bold hover:from-gray-700 hover:to-gray-800 transition-all transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>DASHBOARD</span>
          </button>
        </div>
      </div>
    </div>
  );
}