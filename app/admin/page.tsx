"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AdminPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [draws, setDraws] = useState<any[]>([]);

  // fetch scores
  const fetchScores = async () => {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .order("date", { ascending: false });

    if (data) setScores(data);
  };

  // fetch draws
  const fetchDraws = async () => {
    const { data } = await supabase
      .from("draws")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setDraws(data);
  };

  useEffect(() => {
    fetchScores();
    fetchDraws();
  }, []);

  // run draw
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

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      {/* Run Draw */}
      <button
        onClick={runDraw}
        className="bg-blue-500 px-6 py-3 rounded mb-6"
      >
        Run Draw 🎯
      </button>

      {/* Scores */}
      <div className="bg-zinc-900 p-6 rounded mb-6">
        <h2 className="text-xl mb-4">All Scores</h2>
        {scores.map((s) => (
          <div key={s.id}>
            {s.user_id} → {s.score}
          </div>
        ))}
      </div>

      {/* Draws */}
      <div className="bg-zinc-900 p-6 rounded">
        <h2 className="text-xl mb-4">Draw History</h2>
        {draws.map((d) => (
          <div key={d.id}>
            {d.numbers.join(", ")} ({d.status})
          </div>
        ))}
      </div>
    </div>
  );
}