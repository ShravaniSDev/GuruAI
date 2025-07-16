import { useEffect, useState } from "react";
import ReflectionSummary from "../components/ReflectionSummary";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// ─── Types & Tag Options ─────────────────────────────────────────
interface Note {
  id: string;
  date: string;
  rawDate: string;
  text: string;
  tag: string;
}

const tagOptions = [
  "💪 Motivation",
  "🧠 Insight",
  "😔 Overthinking",
  "🎯 Planning",
  "💬 Emotional Release",
];

// 🔢 Helper: get Monday of week
function getWeekStart(dateStr: string) {
  const date = new Date(dateStr);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff)).toISOString().split("T")[0];
}

function groupByMonth(notes: Note[]) {
  const grouped: Record<string, Note[]> = {};
  notes.forEach((n) => {
    const key = n.rawDate.slice(0, 7);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(n);
  });
  return grouped;
}

function formatMonthTitle(key: string) {
  const [year] = key.split("-");
  const date = new Date(`${key}-01`);
  return `${date.toLocaleString("en-IN", { month: "long" })} ${year}`;
}

// ─── Component ───────────────────────────────────────────────────
export default function GuruNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<"write" | "view">("write");
  const [tag, setTag] = useState(tagOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("");

  // ── Load saved notes
  useEffect(() => {
    const saved = localStorage.getItem("guruai_notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNotes = (updated: Note[]) => {
    localStorage.setItem("guruai_notes", JSON.stringify(updated));
    setNotes(updated);
  };

  const handleAdd = () => {
    if (!input.trim()) return;

    const rawDate = new Date().toISOString().split("T")[0];
    const prettyDate = new Date().toLocaleString("en-IN", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });

    const newNote: Note = {
      id: Date.now().toString(),
      rawDate,
      date: prettyDate,
      text: input.trim(),
      tag,
    };

    saveNotes([newNote, ...notes]);
    setInput("");
  };

  const handleDelete = (id: string) =>
    saveNotes(notes.filter((n) => n.id !== id));

  // ── Filters & Charts prep
  const filteredNotes = notes.filter((n) => {
    const matches = n.text.toLowerCase().includes(searchTerm.toLowerCase());
    const tagOk = !filterTag || n.tag === filterTag;
    return matches && tagOk;
  });

  const grouped = groupByMonth(filteredNotes);

  const tagCounts = tagOptions.map((t) => ({
    tag: t,
    count: notes.filter((n) => n.tag === t).length,
  }));

  const weekCounts: Record<string, number> = {};
  notes.forEach((n) => {
    const wk = getWeekStart(n.rawDate);
    weekCounts[wk] = (weekCounts[wk] || 0) + 1;
  });

  const weeklyData = Object.entries(weekCounts)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([week, count]) => ({
      week: new Date(week).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      count,
    }));

  return (
    <div className="text-white max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">🧠 Guru Notes</h1>

      {/* ── Write Mode ─────────────────────────────── */}
      {viewMode === "write" ? (
        <>
          <p className="text-gray-400">
            Use this space to reflect, record thoughts, breakthroughs, or
            emotions.
          </p>

          <textarea
            className="w-full h-32 text-black p-4 rounded-md"
            placeholder="Write what’s on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="flex items-center gap-4">
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="text-black p-2 rounded-md"
            >
              {tagOptions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>

            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-semibold"
            >
              ➕ Add Note
            </button>

            <button
              onClick={() => setViewMode("view")}
              className="text-sm text-blue-400 underline"
            >
              📂 View Logs
            </button>
          </div>
        </>
      ) : (
        /* ── View Mode ─────────────────────────────── */
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-400">
              📘 Note Archive
            </h2>
            <button
              onClick={() => setViewMode("write")}
              className="text-sm text-blue-400 underline"
            >
              ← Back to Write
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-2">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Search notes..."
              className="p-2 rounded-md text-black w-48"
            />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="p-2 rounded-md text-black"
            >
              <option value="">All Tags</option>
              {tagOptions.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterTag("");
              }}
              className="text-sm text-yellow-400 underline"
            >
              🔁 Reset Filters
            </button>
          </div>

          {/* Monthly groups */}
          {Object.keys(grouped)
            .sort((a, b) => (a < b ? 1 : -1))
            .map((m) => (
              <div key={m} className="space-y-2 mt-4">
                <h3 className="text-lg text-yellow-300 font-semibold border-b border-gray-600 pb-1">
                  📅 {formatMonthTitle(m)}
                </h3>
                {grouped[m].map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-800 rounded-md p-4 relative shadow-md"
                  >
                    <p className="text-gray-400 text-sm mb-1">
                      {note.date} –{" "}
                      <span className="text-pink-400">{note.tag}</span>
                    </p>
                    <p>{note.text}</p>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            ))}

          {/* Tag Bar */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-blue-300 mb-2">
              📊 Mood Tag Frequency
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tagCounts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="tag" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#38bdf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Bar */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold text-purple-300 mb-2">
              📅 Notes Per Week
            </h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#a78bfa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ReflectionSummary />
        </>
      )}

      {/* Export / Import */}
      <div className="space-x-4 mt-4">
        <button
          onClick={() => {
            const raw = localStorage.getItem("guruai_notes");
            const blob = new Blob([raw ?? "[]"], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "guru-notes.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          ⬇️ Export Notes (JSON)
        </button>

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
                if (!Array.isArray(parsed)) {
                  alert("Invalid JSON file.");
                  return;
                }
                localStorage.setItem("guruai_notes", JSON.stringify(parsed));
                alert("✅ Notes imported! Refreshing…");
                window.location.reload();
              } catch {
                alert("⚠️ Failed to import.");
              }
            };
            reader.readAsText(file);
          }}
          className="text-sm text-gray-300"
        />
      </div>
    </div>
  );
}
