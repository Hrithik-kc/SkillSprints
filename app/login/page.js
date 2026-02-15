"use client";

import { loginComponent } from "../core/authLogic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authFeature, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      
      const userCredential = await loginComponent(email, password);
      const user = authFeature.currentUser;

      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          email: user.email,
          xp: 0,
          level: 1,
          title: "Beginner",
          leaderboardPoints: 0,
          practiceProgress: {
            easyCompleted: 0,
            mediumCompleted: 0,
            hardCompleted: 0,
          },
          createdAt: new Date(),
        });
      }

      localStorage.setItem("isAuthenticated", "true");
      window.dispatchEvent(new Event("storage"));

      router.push("/profile");
    } catch (error) {
      console.log("Login Error:", error);
    }
  };

 return (
  <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white">

      <div className="hidden md:flex md:w-1/2 lg:w-[45%] relative h-screen overflow-hidden">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTq6b4WFhr4CIobNt0BHi4HPX9KftEkn9IHNQ&s"//fix the image proper
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
            className="w-full text-gray-700 h-11 px-4 rounded-lg  bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full  text-gray-700 h-11 px-4 rounded-lg border  bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onChange={(event) => setPassword(event.target.value)}

           
          />

          <button
            className="w-full h-11 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
           onClick={handleLogin}>

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