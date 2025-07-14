import { useState } from "react";

function TargetProtocol() {
  const [started, setStarted] = useState(false);

  return (
    <div className="text-white">
      {!started ? (
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl font-bold">🎯 Target Protocol</h1>
          <p className="text-gray-300">
            Welcome to your 21-day mission builder. This tool helps you define a powerful goal,
            build discipline, and track progress — like a personal AI taskforce.
          </p>
          <button
            onClick={() => setStarted(true)}
            className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-lg"
          >
            Start Setup
          </button>
        </div>
      ) : (
        <div className="text-gray-300 space-y-4">
          <h2 className="text-xl font-semibold">🧠 Let’s define your mission...</h2>
          <p>This will be a personalized 21-day protocol designed for your highest goals.</p>
          <p className="italic text-yellow-400">Next: Question 1 — “What is your #1 priority right now?”</p>
        </div>
      )}
    </div>
  );
}

export default TargetProtocol;
