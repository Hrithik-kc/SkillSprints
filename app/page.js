"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerComponent } from "./core/authLogic";

export default function Register() {
  const router = useRouter();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-800 via-slate-700 to-teal-600 px-4">
      
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2 animate-fade-in">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Enter your details to create a new account
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-11 text-gray-700  bg-sky-200 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(event) => setemail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-11 text-gray-700 bg-sky-200 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onChange={(event) => setpassword(event.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full h-11 text-gray-700 bg-sky-200 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <button
            className="w-full h-11 rounded-lg bg-[#00ADB5] hover:bg-[#393E46]  text-white font-semibold transition duration-200"
            onClick={async () => {
              try {
                await registerComponent(email, password);
                router.push("/login");
              } catch {
                console.log("error");
              }
            }}
          >
            Register
          </button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <span
            className="text-[#00ADB5] hover:text-[#393E46]  font-medium cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login Now
          </span>
        </div>
      </div>
    </div>
  );
}
