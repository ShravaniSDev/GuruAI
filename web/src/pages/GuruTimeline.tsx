/* ------------- GuruTimeline.tsx ------------- START */
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function GuruTimeline() {
  const [data, setData] = useState<{ date: string; score: number }[]>([]);

  // Load stored scores into chart
  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const raw = localStorage.getItem("guruai_score_history");
    if (raw) {
      const parsed = JSON.parse(raw);
      const formatted = Object.entries(parsed).map(([date, score]) => ({
        date: format(parseISO(date as string), "dd MMM"),
        score: Number(score),
      }));
      setData(formatted);
    }
  }

  return (
    <div className="text-white max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">📅 Guru Timeline</h1>
      <p className="text-gray-400">Track your discipline score over time.</p>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="date" stroke="#ccc" />
          <YAxis stroke="#ccc" />
          <Tooltip
            wrapperStyle={{ backgroundColor: "#333", border: "none" }}
            contentStyle={{ color: "#fff" }}
          />
          <Bar dataKey="score" fill="#4ade80" />
        </BarChart>
      </ResponsiveContainer>

      <p className="text-sm text-gray-500 italic">
        This graph updates daily based on your Guru Score.
      </p>

      {/* Export JSON */}
      <button
        onClick={() => {
          const raw = localStorage.getItem("guruai_score_history");
          const blob = new Blob([raw ?? "{}"], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "guru-score-history.json";
          a.click();
          URL.revokeObjectURL(url);
        }}
        className="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
      >
        ⬇️ Export Guru Score (JSON)
      </button>

      {/* Import JSON */}
      <input
        type="file"
        accept="application/json"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (ev) => {
            try {
              const content = ev.target?.result as string;
              const parsed = JSON.parse(content);
              if (typeof parsed !== "object" || Array.isArray(parsed)) {
                alert("Invalid JSON format.");
                return;
              }
              localStorage.setItem(
                "guruai_score_history",
                JSON.stringify(parsed)
              );
              alert("✅ Score history imported! Refreshing chart…");
              loadData();
            } catch {
              alert("⚠️ Could not parse JSON file.");
            }
          };
          reader.readAsText(file);
        }}
        className="block mt-2 text-sm text-gray-300"
      />
    </div>
  );
}
/* ------------- GuruTimeline.tsx ------------- END */
