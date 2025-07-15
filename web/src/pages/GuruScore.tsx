import { useEffect, useState } from "react";

/**
 * GuruScore – daily performance score (0‑100)
 * +20  Target Protocol active
 * +30  Marked Progress today
 * +20  Wrote Guru Note today
 * +20  Added Vault entry today
 * +10  Bonus if Progress + Note + Vault all done
*/
export default function GuruScore() {
const [score, setScore] = useState(0);
const [detail, setDetail] = useState({
protocol: false,
progress: false,
note: false,
vault: false,
bonus: false,
});

/** helper: yyyy‑mm‑dd */
const todayKey = (): string => new Date().toISOString().split("T")[0];

// ─── Calculate + Save score on mount ─────────────────────────────
useEffect(() => {
let total = 0;
const d = {
protocol: false,
progress: false,
note: false,
vault: false,
bonus: false,
};
// 🎯 Target Protocol set?
if (localStorage.getItem("guruai_target_protocol")) {
total += 20;
d.protocol = true;
}

// ✅ Progress marked today?
const progressRaw = localStorage.getItem("guruai_progress_data");
if (progressRaw) {
const { lastCheckIn } = JSON.parse(progressRaw);
if (lastCheckIn === todayKey()) {
total += 30;
d.progress = true;
}
}

// 🧠 Guru Note today?
const notes = JSON.parse(localStorage.getItem("guruai_notes") || "[]");
const hasNoteToday = notes.some((n: any) =>
(n.rawDate ?? "").startsWith(todayKey())
);
if (hasNoteToday) {
total += 20;
d.note = true;
}

// 🔐 Vault entry today?
const vault = JSON.parse(localStorage.getItem("guruai_vault_notes") || "[]");
const hasVaultToday = vault.some((v: any) =>
(v.rawDate ?? "").startsWith(todayKey())
);
if (hasVaultToday) {
total += 20;
d.vault = true;
}

// 📌 Bonus
if (d.progress && d.note && d.vault) {
total += 10;
d.bonus = true;
}

// ✅ Save today’s score in localStorage history
const prev = JSON.parse(localStorage.getItem("guruai_score_history") || "{}");
localStorage.setItem(
"guruai_score_history",
JSON.stringify({ ...prev, [todayKey()]: total })
);

setDetail(d);
setScore(total);
}, []); // <-- closes useEffect//
return (
  <div className="text-white max-w-2xl space-y-6">
    <h1 className="text-3xl font-bold">📈 Guru Score</h1>
    <p className="text-gray-400">
      Daily alignment & discipline score (out of 100)
    </p>

    <div className="text-7xl font-extrabold text-green-400">{score}</div>

    <div className="bg-gray-800 p-4 rounded-xl space-y-1 text-sm text-gray-300">
      <p>🎯 Target Protocol active {detail.protocol ? "+20 ✅" : "+0 ❌"}</p>
      <p>✅ Progress marked        {detail.progress ? "+30 ✅" : "+0 ❌"}</p>
      <p>🧠 Guru Note written     {detail.note ? "+20 ✅" : "+0 ❌"}</p>
      <p>🔐 Vault entry added     {detail.vault ? "+20 ✅" : "+0 ❌"}</p>
      <p>📌 Bonus (all 3)         {detail.bonus ? "+10 ✅" : "+0 ❌"}</p>
    </div>

    <p className="mt-4 italic text-blue-300">
      {score >= 90
        ? "🔥 Outstanding focus & clarity!"
        : score >= 60
        ? "💪 Solid progress — keep pushing!"
        : "🌀 Let’s refocus tomorrow. You’ve got this!"}
    </p>
  </div>
);
}
