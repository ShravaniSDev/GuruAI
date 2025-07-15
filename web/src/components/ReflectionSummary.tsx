import { useEffect, useMemo, useState } from "react";
import html2pdf from "html2pdf.js";        // ← NEW

// ────────────────────────────────────────────
// Types & helpers
// ────────────────────────────────────────────
interface Note {
  id: string;
  date: string;
  rawDate: string;
  text: string;
  tag: string;
}
interface Summary {
  total: number;
  recent: Note[];
  tagFrequency: Record<string, number>;
  topWords: string[];
  tone: string;
  suggestion: string;
}

const stopwords = [
  "i","the","and","a","to","in","on","of","my","is","that","was","it","for","this",
  "at","with","but","me","so","just","now","been","am","are","not","very",
];

function getSummary(notes: Note[]): Summary {
  const recent = notes.filter((note) => {
    const now = new Date();
    const noteDate = new Date(note.rawDate);
    const diffDays = (now.getTime() - noteDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 14; // last 14 days
  });

  // Tag frequency
  const tagFrequency: Record<string, number> = {};
  recent.forEach((n) => (tagFrequency[n.tag] = (tagFrequency[n.tag] || 0) + 1));

  // Word frequency (basic)
  const words = recent
    .flatMap((n) => n.text.toLowerCase().split(/\s+/))
    .filter((w) => w.length > 2 && !stopwords.includes(w));
  const wordFreq: Record<string, number> = {};
  words.forEach((w) => (wordFreq[w] = (wordFreq[w] || 0) + 1));
  const topWords = Object.entries(wordFreq)
    .sort(([, a], [, b]) => b - a)
    .map(([w]) => w)
    .slice(0, 5);

  // Tone detection (very simple)
  let tone = "balanced";
  const lowWords = ["tired","low","guilty","stuck","sad"];
  const powerWords = ["progress","built","launched","completed","happy"];
  const totalWords = words.length;
  const lowCount = words.filter((w) => lowWords.includes(w)).length;
  const powerCount = words.filter((w) => powerWords.includes(w)).length;

  if (lowCount / totalWords > 0.1) tone = "low‑energy";
  else if (powerCount / totalWords > 0.1) tone = "driven";

  const suggestion =
    tone === "low‑energy"
      ? "Prioritize rest & self‑care this week."
      : tone === "driven"
      ? "Ride the momentum — keep shipping!"
      : "Balance creation and reflection over the next week.";

  return { total: recent.length, recent, tagFrequency, topWords, tone, suggestion };
}

// ────────────────────────────────────────────
// Component
// ────────────────────────────────────────────
export default function ReflectionSummary() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("guruai_notes");
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const summary = useMemo(() => getSummary(notes), [notes]);

  // ── PDF download logic ─────────────────────
  function downloadPDF() {
    const element = document.getElementById("guru-reflection-summary");
    if (!element) return;

    const opt = {
      margin:     0.5,
      filename:   `guru-summary-${new Date().toISOString().split("T")[0]}.pdf`,
      image:      { type: "jpeg", quality: 0.98 },
      html2canvas:{ scale: 2 },
      jsPDF:      { unit: "in", format: "letter", orientation: "portrait" },
    };

    html2pdf().set(opt).from(element).save();
  }

  // ── UI ─────────────────────────────────────
  return (
    <div
      id="guru-reflection-summary"
      className="mt-10 p-6 rounded-xl bg-gray-800 text-white space-y-4 shadow-md border border-gray-700"
    >
      {/* Header + download */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-orange-300">🧠 AI Reflection Summary</h2>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
        >
          📥 Download PDF
        </button>
      </div>

      <p className="text-sm text-gray-400">
        Based on your last {summary.recent.length} notes (14‑day window)
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
        {/* Tag frequency */}
        <div>
          <p className="text-gray-400">Emotional Tags</p>
          <ul className="list-disc list-inside">
            {Object.entries(summary.tagFrequency).map(([tag, count]) => (
              <li key={tag}>
                {tag}: {count}
              </li>
            ))}
          </ul>
        </div>

        {/* Top words */}
        <div>
          <p className="text-gray-400">Most Common Words</p>
          <p className="text-blue-300">
            {summary.topWords.length > 0 ? summary.topWords.join(", ") : "N/A"}
          </p>
        </div>

        {/* Tone */}
        <div>
          <p className="text-gray-400">Tone Detected</p>
          <p
            className={
              summary.tone === "low‑energy"
                ? "text-red-400"
                : summary.tone === "driven"
                ? "text-green-400"
                : "text-yellow-300"
            }
          >
            {summary.tone}
          </p>
        </div>
      </div>

      {/* Weekly suggestion */}
      <div className="text-lg mt-4 text-purple-200">
        <span className="font-bold text-white">📌 Weekly Suggestion: </span>
        {summary.suggestion}
      </div>
    </div>
  );
}
