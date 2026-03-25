"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [scores, setScores] = useState<any[]>([]);
  const [draws, setDraws] = useState<any[]>([]);

  // 🔐 LOGIN CHECK
  const handleLogin = () => {
    if (email === "admin@test.com" && password === "admin123") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  // 🔹 Fetch scores
  const fetchScores = async () => {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .order("date", { ascending: false });

    if (data) setScores(data);
  };

  // 🔹 Fetch draws
  const fetchDraws = async () => {
    const { data } = await supabase
      .from("draws")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setDraws(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchScores();
      fetchDraws();
    }
  }, [isLoggedIn]);

  // 🔥 Run Draw
  const runDraw = async () => {
    const numbersSet = new Set<number>();

    while (numbersSet.size < 5) {
      numbersSet.add(Math.floor(Math.random() * 45) + 1);
    }

    const randomNumbers = Array.from(numbersSet);

    await supabase.from("draws").insert([
      {
        numbers: randomNumbers,
        status: "completed",
      },
    ]);

    alert("Draw executed successfully!");
    fetchDraws();
  };

  // 🔐 LOGIN UI
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-zinc-900 p-6 rounded w-80">
          <h1 className="text-xl mb-4 text-center">Admin Login</h1>

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
            className="bg-blue-500 w-full py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // 🔥 ADMIN PANEL UI
  return (
    <div className="min-h-screen bg-black text-white p-10">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Panel</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-400 mb-6">
        Manage system operations, monitor scores, and control draw execution.
      </p>

      {/* DRAW CONTROL */}
      <div className="mb-6">
        <button
          onClick={runDraw}
          className="bg-blue-500 px-6 py-3 rounded hover:bg-blue-600"
        >
          Run Draw 🎯
        </button>
      </div>

      {/* SCORES */}
      <div className="bg-zinc-900 p-6 rounded mb-6">
        <h2 className="text-xl mb-4">All User Scores</h2>

        {scores.length === 0 ? (
          <p>No scores available</p>
        ) : (
          scores.map((s) => (
            <div key={s.id} className="mb-1">
              {s.user_id} → {s.score}
            </div>
          ))
        )}
      </div>

      {/* DRAWS */}
      <div className="bg-zinc-900 p-6 rounded">
        <h2 className="text-xl mb-4">Draw History</h2>

        {draws.length === 0 ? (
          <p>No draws yet</p>
        ) : (
          draws.map((d) => (
            <div key={d.id} className="mb-1">
              {d.numbers.join(", ")} ({d.status})
            </div>
          ))
        )}
      </div>
    </div>
  );
}