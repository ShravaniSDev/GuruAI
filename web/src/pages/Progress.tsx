import { useEffect, useState } from "react";
import { format, subDays } from "date-fns";

export default function Progress() {
  const [protocol, setProtocol] = useState<string[] | null>(null);
  const [today, setToday] = useState("");
  const [streak, setStreak] = useState(0);
  const [lastCheckIn, setLastCheckIn] = useState("");
  const [alreadyMarked, setAlreadyMarked] = useState(false);

  const getTodayKey = () => new Date().toISOString().split("T")[0]; // yyyy‑mm‑dd

  useEffect(() => {
    const storedProtocol = localStorage.getItem("guruai_target_protocol");
    if (storedProtocol) setProtocol(JSON.parse(storedProtocol));

    const todayStr = new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "short",
    });
    setToday(todayStr);

    const saved = localStorage.getItem("guruai_progress_data");
    if (saved) {
      const { streak, lastCheckIn } = JSON.parse(saved);
      const todayKey = getTodayKey();

      setStreak(streak || 0);
      setLastCheckIn(lastCheckIn || "");

      if (lastCheckIn === todayKey) {
        setAlreadyMarked(true);
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = yesterday.toISOString().split("T")[0];
        setStreak(lastCheckIn === yKey ? streak : 0);
      }
    }
  }, []);

  const markToday = () => {
    const todayKey = getTodayKey();

    if (alreadyMarked) return;

    const newStreak = lastCheckIn === todayKey ? streak : streak + 1;
    setStreak(newStreak);
    setLastCheckIn(todayKey);
    setAlreadyMarked(true);

    localStorage.setItem(
      "guruai_progress_data",
      JSON.stringify({
        streak: newStreak,
        lastCheckIn: todayKey,
      })
    );

    alert("✅ Marked! Keep the streak alive.");
  };

  function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      days.push(format(date, "yyyy-MM-dd"));
    }
    return days;
  }

  return (
    <div className="text-white space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold">📊 Progress</h1>
      <p className="text-gray-400">
        Today is{" "}
        <span className="text-yellow-400 font-medium">{today}</span>
      </p>

      {protocol ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-green-400">
            🎯 Your Active Protocol
          </h2>
          <ul className="bg-gray-800 p-6 rounded-xl space-y-2">
            <li>
              <strong className="text-yellow-300">Priority:</strong>{" "}
              {protocol[0]}
            </li>
            <li>
              <strong className="text-yellow-300">Why:</strong> {protocol[1]}
            </li>
            <li>
              <strong className="text-yellow-300">Success looks like:</strong>{" "}
              {protocol[2]}
            </li>
            <li>
              <strong className="text-yellow-300">Actions:</strong>{" "}
              {protocol[3]}
            </li>
            <li>
              <strong className="text-yellow-300">Avoid:</strong>{" "}
              {protocol[4]}
            </li>
          </ul>

          <div className="bg-gray-900 p-4 rounded-xl mt-4 border border-gray-700 space-y-2">
            <h3 className="text-lg font-semibold text-blue-300">
              🔥 Daily Tracker
            </h3>

            {/* 7-DAY STREAK VISUAL */}
            <div className="flex space-x-2 mt-2">
              {getLast7Days().map((date) => {
                const isMarked =
                  date === lastCheckIn ||
                  (date !== getTodayKey() && streak > 0);
                return (
                  <div
                    key={date}
                    title={date}
                    className={`w-6 h-6 rounded-full border ${
                      isMarked ? "bg-green-400" : "bg-gray-600"
                    }`}
                  ></div>
                );
              })}
            </div>

            <p className="text-gray-400">
              Streak:{" "}
              <span className="text-white font-bold">
                {streak} day{streak === 1 ? "" : "s"}
              </span>
            </p>

            {alreadyMarked ? (
              <p className="text-green-400">
                ✅ You’ve already marked today. Keep going!
              </p>
            ) : (
              <button
                onClick={markToday}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-md"
              >
                ✅ Mark Today Done
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-red-400">
          No protocol found. Please complete setup from the Target Protocol tab.
        </p>
      )}
    </div>
  );
}
