"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerComponent } from "./core/authLogic";

export default function Register() {
  const router = useRouter();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-700 to-teal-600 px-4">
      
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 animate-fade-in">
          Create Account
        </h1>

          <p className="text-gray-400 mb-6">
            Start your gamified learning journey 🚀
          </p>

          <div className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full h-11 px-4 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setemail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full h-11 px-4 rounded-lg  bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setpassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full h-11 px-4 rounded-lg  bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <button
              className="w-full h-11 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
              onClick={async () => {
                try {
                  await registerComponent(email, password);
                  router.push("/login");
                } catch (err) {
                  alert("Registration failed");
                }
              }}
            >
              Create account
            </button>
          </div>

          <div className="text-center mt-6 text-sm text-gray-400">
            Already have an account?{" "}
            <span
              className="text-purple-400 font-medium cursor-pointer hover:underline"
              onClick={() => router.push("/login")}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
