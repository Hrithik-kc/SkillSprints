"use client";

import { loginComponent } from "../core/authLogic";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [teacherId, setTeacherId] = useState("");

  const handleLogin = async () => {
    try {
      await loginComponent(email, password, role, teacherId, router);
    } catch (error) {
      alert("Authentication failed.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">

      <div className="hidden md:flex md:w-1/2 lg:w-[45%] relative h-screen overflow-hidden">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq6b4WFhr4CIobNt0BHi4HPX9KftEkn9IHNQ&s"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 lg:w-[55%] flex items-center justify-center px-6">
        <div className="w-full max-w-md bg-black rounded-2xl shadow-2xl p-8">

          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>

          <p className="text-center text-gray-400 mb-6">
            Enter your email and password to continue
          </p>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full h-11 px-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-11 px-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-left">
              <p className="text-sm mb-2 text-gray-300">Select Role</p>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="student"
                    checked={role === "student"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Student
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="admin"
                    checked={role === "admin"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  Admin
                </label>
              </div>
            </div>

            {role === "admin" && (
              <input
                type="password"
                placeholder="Enter Teacher ID"
                className="w-full h-11 px-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={(e) => setTeacherId(e.target.value)}
              />
            )}

            <button
              className="w-full h-11 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-gray-500">
            Donot have an account?{" "}
            <span
              className="text-[#00ADB5] hover:text-[#393E46] font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/")}
            >
              Register Now
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}