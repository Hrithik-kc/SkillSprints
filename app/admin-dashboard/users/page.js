"use client";
import { useEffect, useState } from "react";
import { authFeature, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const user = authFeature.currentUser;
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchUsers = async () => {
      const qSnap = await getDocs(collection(db, "users"));
      setUsers(qSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-black/20 text-white">
      <div className="max-w-4xl mx-auto bg-white/5 p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Registered Users</h3>
          <button onClick={() => router.push('/admin-dashboard')} className="bg-indigo-600 px-3 py-1 rounded">Back</button>
        </div>

        {loading && <p className="text-gray-300">Loading...</p>}

        {!loading && (
          <table className="w-full text-sm text-left">
            <thead className="text-gray-300">
              <tr>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">XP</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-white/10">
                  <td className="py-2">{u.email}</td>
                  <td className="py-2">{u.role}</td>
                  <td className="py-2">{u.xp ?? u.leaderboardPoints ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
