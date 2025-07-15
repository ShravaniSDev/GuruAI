import { useEffect, useState } from "react";

interface VaultNote {
  id: string;
  date: string;
  text: string;
  rawDate: string; // for grouping
}

function encode(text: string): string {
  return btoa(unescape(encodeURIComponent(text)));
}

function decode(text: string): string {
  return decodeURIComponent(escape(atob(text)));
}

function groupByMonth(notes: VaultNote[]) {
  const grouped: Record<string, VaultNote[]> = {};

  notes.forEach((note) => {
    const key = note.rawDate.slice(0, 7); // yyyy-mm
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

function Vault() {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [savedPin, setSavedPin] = useState<string | null>(null);

  const [notes, setNotes] = useState<VaultNote[]>([]);
  const [input, setInput] = useState("");
  const [viewMode, setViewMode] = useState<"write" | "view">("write");

  useEffect(() => {
    const storedPin = localStorage.getItem("guruai_vault_pin");
    const storedNotes = localStorage.getItem("guruai_vault_notes");

    if (storedPin) setSavedPin(storedPin);
    if (storedNotes) setNotes(JSON.parse(storedNotes));
  }, []);

  const saveNotes = (updated: VaultNote[]) => {
    setNotes(updated);
    localStorage.setItem("guruai_vault_notes", JSON.stringify(updated));
  };

  const handleUnlock = () => {
    if (savedPin) {
      if (pinInput === savedPin) {
        setUnlocked(true);
      } else {
        alert("❌ Incorrect pin.");
      }
    } else {
      if (pinInput.trim().length < 4) {
        alert("Pin must be at least 4 characters.");
        return;
      }
      localStorage.setItem("guruai_vault_pin", pinInput);
      setSavedPin(pinInput);
      setUnlocked(true);
    }
    setPinInput("");
  };

  const handleAdd = () => {
    if (input.trim() === "") return;

    const rawDate = new Date().toISOString().split("T")[0]; // yyyy-mm-dd
    const prettyDate = new Date().toLocaleString("en-IN", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "short",
    });

    const newNote: VaultNote = {
      id: Date.now().toString(),
      date: prettyDate,
      rawDate,
      text: encode(input.trim()),
    };

    const updated = [newNote, ...notes];
    saveNotes(updated);
    setInput("");
  };

  const handleDelete = (id: string) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated);
  };

  const grouped = groupByMonth(notes);

  return (
    <div className="text-white max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">🔐 Vault</h1>

      {!unlocked ? (
        <div className="space-y-4">
          <p className="text-gray-400">
            {savedPin ? "Enter your pin to unlock." : "Set a pin to activate your vault."}
          </p>
          <input
            type="password"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="px-4 py-2 rounded-md text-black"
            placeholder="Enter pin"
          />
          <button
            onClick={handleUnlock}
            className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md"
          >
            {savedPin ? "Unlock Vault" : "Set Pin & Unlock"}
          </button>
        </div>
      ) : viewMode === "write" ? (
        <>
          <p className="text-gray-400">Write freely. Only you can see this.</p>
          <textarea
            className="w-full h-32 text-black p-4 rounded-md"
            placeholder="Your secrets, reflections, or affirmations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          ></textarea>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md font-semibold"
            >
              ➕ Add Vault Note
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
            <h2 className="text-xl font-semibold text-pink-400">🗃 Vault Archive</h2>
            <button
              onClick={() => setViewMode("write")}
              className="text-sm text-blue-400 underline"
            >
              ← Back to Vault
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
                    <p className="text-gray-400 text-sm mb-1">{note.date}</p>
                    <p>{decode(note.text)}</p>
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
        </>
      )}
    </div>
  );
}

export default Vault;
