"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // 🔐 SIGNUP
  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful! You can now login.");
    }
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-6 rounded w-80">
        <h1 className="text-xl mb-4 text-center">User Login / Signup</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 text-black rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 text-black rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-500 w-full py-2 rounded mb-2 hover:bg-blue-600"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          className="bg-green-500 w-full py-2 rounded hover:bg-green-600"
        >
          Signup
        </button>
      </div>
    </div>
  );
}