"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [score, setScore] = useState("");
  const [scores, setScores] = useState<any[]>([]);
  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  const user_id = "demo-user";

  // 🔹 fake subscription data
  const subscription = {
    status: "Active",
    renewal: "2026-04-30",
  };

  // 🔹 charity
  const [charity, setCharity] = useState("Red Cross");
  const [percentage, setPercentage] = useState(10);

  // 🔹 winnings
  const winnings = matches >= 3 ? 1000 : 0;

  // fetch scores
  const fetchScores = async () => {
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user_id)
      .order("date", { ascending: false });

    if (data) setScores(data);
  };

  useEffect(() => {
    fetchScores();
  }, []);

  // submit score
  const handleSubmit = async () => {
    if (!score) return;

    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user_id)
      .order("date", { ascending: true });

    if (data && data.length >= 5) {
      await supabase.from("scores").delete().eq("id", data[0].id);
    }

    await supabase.from("scores").insert([
      { user_id, score: parseInt(score) },
    ]);

    setScore("");
    fetchScores();
  };

  // draw
  const runDraw = async () => {
    if (scores.length < 5) {
      alert("Enter 5 scores first!");
      return;
    }

    const numbersSet = new Set<number>();
    while (numbersSet.size < 5) {
      numbersSet.add(Math.floor(Math.random() * 45) + 1);
    }

    const randomNumbers = Array.from(numbersSet);

    setDrawNumbers(randomNumbers);

    await supabase.from("draws").insert([
      { numbers: randomNumbers, status: "completed" },
    ]);

    const userScores = scores.map((s) => s.score);

    const matchCount = randomNumbers.filter((num) =>
      userScores.includes(num)
    ).length;

    setMatches(matchCount);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Admin Button */}
      <a
        href="/admin"
        className="bg-red-500 px-4 py-2 rounded mb-6 inline-block"
      >
        Admin Panel ⚙️
      </a>

      {/* 🔥 Subscription */}
      <div className="bg-zinc-900 p-4 mb-4 rounded">
        <h2>Subscription</h2>
        <p>Status: {subscription.status}</p>
        <p>Renewal: {subscription.renewal}</p>
      </div>

      {/* 🔥 Charity */}
      <div className="bg-zinc-900 p-4 mb-4 rounded">
        <h2>Charity Selection</h2>

        <select
          value={charity}
          onChange={(e) => setCharity(e.target.value)}
          className="text-black p-2 mb-2"
        >
          <option>Red Cross</option>
          <option>UNICEF</option>
          <option>WWF</option>
        </select>

        <input
          type="number"
          value={percentage}
          onChange={(e) => setPercentage(Number(e.target.value))}
          className="text-black p-2"
        />
        <p>{percentage}% goes to {charity}</p>
      </div>

      {/* 🔥 Score Input */}
      <div className="bg-zinc-900 p-4 mb-4 rounded">
        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="text-black p-2"
        />
        <button onClick={handleSubmit} className="bg-green-500 px-4 py-2 ml-2">
          Submit
        </button>
      </div>

      {/* 🔥 Scores */}
      <div className="bg-zinc-900 p-4 mb-4 rounded">
        <h2>Your Scores</h2>
        {scores.map((s) => (
          <div key={s.id}>{s.score}</div>
        ))}
      </div>

      {/* 🔥 Participation */}
      <div className="bg-zinc-900 p-4 mb-4 rounded">
        <h2>Participation</h2>
        <p>Total Entries: {scores.length}</p>
        <p>Next Draw: Upcoming</p>
      </div>

      {/* 🔥 Draw */}
      <button onClick={runDraw} className="bg-blue-500 px-6 py-3 mb-4">
        Run Draw 🎯
      </button>

      {/* 🔥 Result */}
      {drawNumbers.length > 0 && (
        <div className="bg-zinc-900 p-4 mb-4 rounded">
          <p>Numbers: {drawNumbers.join(", ")}</p>
          <p>Matches: {matches}</p>
        </div>
      )}

      {/* 🔥 Winnings */}
      <div className="bg-zinc-900 p-4 rounded">
        <h2>Winnings</h2>
        <p>Total Won: ₹{winnings}</p>
        <p>Status: {winnings > 0 ? "Processing" : "No winnings"}</p>
      </div>
    </div>
  );
}