// same imports as before
import ReflectionSummary from "../components/ReflectionSummary";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// same interfaces and tagOptions
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
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust for Monday
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split("T")[0];
}

function groupByMonth(notes: Note[]) {
  const grouped: Record<string, Note[]> = {};
  notes.forEach((note) => {
    const key = note.rawDate.slice(0, 7);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(note);
  });
  return grouped;
}

function formatMonthTitle(key: string): string {
  const [year, month] = key.split("-");
  const date = new Date(`${key}-01`);
  return `${date.toLocaleString("en-IN", { month: "long" })} ${year}`;
}

function GuruNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<"write" | "view">("write");
  const [tag, setTag] = useState(tagOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("guruai_notes");
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  const saveNotes = (updated: Note[]) => {
    localStorage.setItem("guruai_notes", JSON.stringify(updated));
    setNotes(updated);
  };

  const handleAdd = () => {
    if (input.trim() === "") return;

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

    const updated = [newNote, ...notes];
    saveNotes(updated);
    setInput("");
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesText = note.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag === "" || note.tag === filterTag;
    return matchesText && matchesTag;
  });

  const grouped = groupByMonth(filteredNotes);

  const tagCounts = tagOptions.map((tag) => ({
    tag,
    count: notes.filter((n) => n.tag === tag).length,
  }));

  const weekCounts: Record<string, number> = {};
  notes.forEach((note) => {
    const weekStart = getWeekStart(note.rawDate);
    if (!weekCounts[weekStart]) weekCounts[weekStart] = 0;
    weekCounts[weekStart]++;
  });

  const weeklyData = Object.entries(weekCounts)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([weekStart, count]) => ({
      week: new Date(weekStart).toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      }),
      count,
    }));

  return (
    <div className="text-white max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">🧠 Guru Notes</h1>

      {viewMode === "write" ? (
        <>
          <p className="text-gray-400">
            Use this space to reflect, record thoughts, breakthroughs, or emotions.
          </p>

          <textarea
            className="w-full h-32 text-black p-4 rounded-md"
            placeholder="Write what’s on your mind..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>

          <div className="flex items-center gap-4">
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="text-black p-2 rounded-md"
            >
              {tagOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
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
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-green-400">📘 Note Archive</h2>
            <button
              onClick={() => setViewMode("write")}
              className="text-sm text-blue-400 underline"
            >
              ← Back to Write
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <input
              type="text"
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
                <option key={t} value={t}>
                  {t}
                </option>
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

          {Object.keys(grouped)
            .sort((a, b) => (a < b ? 1 : -1))
            .map((monthKey) => (
              <div key={monthKey} className="space-y-2 mt-4">
                <h3 className="text-lg text-yellow-300 font-semibold border-b border-gray-600 pb-1">
                  📅 {formatMonthTitle(monthKey)}
                </h3>
                {grouped[monthKey].map((note) => (
                  <div
                    key={note.id}
                    className="bg-gray-800 rounded-md p-4 relative shadow-md"
                  >
                    <p className="text-gray-400 text-sm mb-1">
                      {note.date} – <span className="text-pink-400">{note.tag}</span>
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

          {/* Tag Chart */}
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

          {/* Weekly Chart */}
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
    </div>
  );
}

export default GuruNotes;
