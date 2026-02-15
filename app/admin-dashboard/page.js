"use client";
import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [userData, setUserData] = useState(null);
  const [usersCount, setUsersCount] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notAdmin, setNotAdmin] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = authFeature.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      const docSnap = await getDoc(doc(db, "users", user.uid));
      const data = docSnap.data();
      setUserData(data);

      if (!data || data.role !== "admin") {
        setNotAdmin(true);
        return;
      }

     
      const qSnap = await getDocs(collection(db, "users"));
      setUsersCount(qSnap.size);
      setUsersList(qSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };

    fetchUser();
  }, []);

  const generateQuestions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "generate" })
      });
      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  if (notAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white/5 p-8 rounded-2xl text-center text-white max-w-lg">
          <h2 className="text-2xl font-semibold mb-2">Access denied</h2>
          <p className="text-gray-300 mb-4">You are not an admin.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-900 via-purple-900 to-black text-white">
      <nav className="flex justify-between items-center px-8 py-4 bg-black/30 backdrop-blur-lg border-b border-white/10">
        <h2 className="text-2xl font-bold text-indigo-400">🚀 AptiMaster Admin</h2>
        <div className="flex items-center gap-4">
          
          <button
            onClick={() => router.push("/admin-dashboard/users")}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition duration-300"
          >
            🧾 Users List
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center mt-12 px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 w-full max-w-3xl text-center animate-fade-in">
          <h3 className="text-2xl font-semibold mb-2">Admin Dashboard</h3>
          <p className="text-gray-300 mb-4">Welcome, {userData?.email || "..."}</p>

          <div className="flex justify-center gap-6 mb-6 flex-wrap">
            <div className="bg-white/10 px-6 py-4 rounded-xl hover:scale-105 transition">
              <p className="text-sm text-gray-300">Total Users</p>
              <p className="text-xl font-bold text-indigo-400">{usersCount ?? "..."}</p>
            </div>

            <div className="bg-white/10 px-6 py-4 rounded-xl hover:scale-105 transition">
              <p className="text-sm text-gray-300">Admin Email</p>
              <p className="text-xl font-bold text-yellow-400">{userData?.email}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <div className="flex gap-4 flex-wrap justify-center">
              <button
                onClick={() => router.push("/admin-dashboard/users")}
                className="bg-indigo-600 hover:bg-indigo-700 py-3 px-6 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
              >
                👥 Manage Users
              </button>

              <button
                onClick={generateQuestions}
                className="bg-purple-600 hover:bg-purple-700 py-3 px-6 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
              >
                {loading ? "Generating..." : "🧾 Generate Questions"}
              </button>

              <button
                onClick={() => router.push("/")}
                className="bg-pink-600 hover:bg-pink-700 py-3 px-6 rounded-xl font-semibold shadow-lg transition transform hover:scale-105"
              >
                ↩ Back
              </button>
            </div>

            {questions && (
              <div className="mt-6 text-left bg-white/5 p-4 rounded-lg max-h-64 overflow-auto">
                <h4 className="font-semibold mb-2">Generated Questions (preview)</h4>
                {questions.length === 0 && <p className="text-gray-300">No questions returned.</p>}
                <ol className="list-decimal pl-6 space-y-3">
                  {questions.map((q, idx) => (
                    <li key={idx} className="text-sm">
                      <div className="text-white">{q.question}</div>
                      <div className="text-gray-300 text-xs mt-1">Options: {q.options?.join(", ")}</div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {usersList.length > 0 && (
              <div className="mt-6 text-left bg-white/5 p-4 rounded-lg w-full">
                <h4 className="font-semibold mb-2">Recent Users</h4>
                <ul className="space-y-2 text-sm text-gray-200">
                  {usersList.slice(0, 8).map((u) => (
                    <li key={u.id} className="flex justify-between">
                      <span>{u.email}</span>
                      <span className="text-gray-400">{u.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
