"use client";
// deploy trigger

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [score, setScore] = useState("");
  const [scores, setScores] = useState<any[]>([]);
  const [drawNumbers, setDrawNumbers] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);

  const user_id = "demo-user";

  // 🔹 Fetch scores
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

  // 🔹 Submit score (5-score logic)
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
      {
        user_id,
        score: parseInt(score),
      },
    ]);

    setScore("");
    fetchScores();
  };

  // 🔥 Draw Logic
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
      {
        numbers: randomNumbers,
        status: "completed",
      },
    ]);

    const userScores = scores.map((s) => s.score);

    const matchCount = randomNumbers.filter((num) =>
      userScores.includes(num)
    ).length;

    setMatches(matchCount);
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">
      {/* HEADER */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* ADMIN BUTTON */}
      <a
        href="/admin"
        className="bg-red-500 px-4 py-2 rounded mb-6 inline-block hover:bg-red-600"
      >
        Go to Admin Panel ⚙️
      </a>

      {/* 🔥 Subscription */}
      <div className="bg-zinc-900 p-4 mb-4 rounded">
        <h2 className="font-semibold">Subscription</h2>
        <p>Status: Active</p>
        <p>Renewal: 30 Apr 2026</p>
      </div>
      {/* Subscription Plan */}
<div className="bg-zinc-900 p-4 mb-4 rounded">
  <h2 className="font-semibold mb-2">Choose Subscription</h2>

  <button className="bg-green-500 px-4 py-2 mr-2 rounded">
    Monthly ₹199
  </button>

  <button className="bg-blue-500 px-4 py-2 rounded">
    Yearly ₹1999
  </button>

  <p className="mt-2 text-sm text-gray-400">
    Subscription enables participation in monthly draws and charity contribution.
  </p>
</div>

      {/* 🔥 Charity */}
      <div className="bg-zinc-900 p-4 mb-4 rounded">
        <h2 className="font-semibold">Charity</h2>
        <p>Selected: Red Cross</p>
        <p>Contribution: 10%</p>
      </div>

      {/* 🔹 Score Input */}
      <div className="bg-zinc-900 p-6 rounded-lg max-w-md mb-6">
        <h2 className="text-xl mb-4">Enter Golf Score</h2>

        <input
          type="number"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          placeholder="Enter score (1-45)"
          className="w-full p-2 text-black rounded mb-4"
        />

        <button
          onClick={handleSubmit}
          className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
        >
          Submit Score
        </button>
      </div>

      {/* 🔹 Scores */}
      <div className="bg-zinc-900 p-6 rounded-lg max-w-md mb-6">
        <h2 className="text-xl mb-4">Your Scores</h2>

        {scores.length === 0 ? (
          <p>No scores yet</p>
        ) : (
          scores.map((s) => (
            <div key={s.id} className="mb-1">
              Score: {s.score}
            </div>
          ))
        )}
      </div>

      {/* 🔥 Participation */}
      <div className="bg-zinc-900 p-4 mb-4 rounded">
        <h2 className="font-semibold">Participation</h2>
        <p>Total Entries: {scores.length}</p>
        <p>Next Draw: Upcoming</p>
      </div>

      {/* 🔹 Draw Button */}
      <button
        onClick={runDraw}
        className="bg-blue-500 px-6 py-3 rounded mb-6 hover:bg-blue-600"
      >
        Run Draw 🎯
      </button>

      {/* 🔹 Draw Result */}
      {drawNumbers.length > 0 && (
        <div className="bg-zinc-900 p-6 rounded-lg max-w-md mb-6">
          <h2 className="text-xl mb-4">Draw Result</h2>

          <p>Numbers: {drawNumbers.join(", ")}</p>
          <p className="mt-2">Matches: {matches}</p>

          {matches >= 3 && (
            <p className="text-green-400 mt-2">🎉 You Won!</p>
          )}
        </div>
      )}

      {/* 🔥 Winnings */}
      <div className="bg-zinc-900 p-4 rounded">
        <h2 className="font-semibold">Winnings</h2>
        <p>Total Won: ₹{matches >= 3 ? 1000 : 0}</p>
        <p>Status: {matches >= 3 ? "Processing" : "No winnings"}</p>
      </div>
    </div>
  );
}