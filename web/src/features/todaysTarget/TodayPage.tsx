import React, { useEffect, useState } from 'react';
import TodayTargetCard from './TodayTargetCard';
import { generateTodayTarget } from './generator';
import type { DailyTarget } from './types';
import { loadProtocol } from '../../utils/storage/protocol';
import { loadNotes } from '../../utils/storage/notes';


const STORAGE_KEY = 'today_target';

function TodaysPage() {
  const [target, setTarget] = useState<DailyTarget | null>(null);

 useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const today = new Date().toLocaleDateString();

  if (saved) {
    const parsed = JSON.parse(saved) as DailyTarget;
    if (parsed.generatedFor === today) {
      setTarget(parsed);
      return;
    }
  }

  // ✅ load protocol & notes
  const protocol = loadProtocol();
  const notes = loadNotes();
  const newTarget = generateTodayTarget(protocol, notes);
  setTarget(newTarget);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newTarget));
}, []);


  const handleRegenerate = () => {
  const protocol = loadProtocol();
  const notes = loadNotes();
  const newTarget = generateTodayTarget(protocol, notes);
  setTarget(newTarget);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newTarget));
};


  if (!target) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">✅ Today Page Loaded</h1> {/* 👈 Add it here */}
      
      <h1 className="text-3xl font-bold mb-4">🎯 Today’s Target</h1>

      <button
        onClick={handleRegenerate}
        className="px-4 py-2 rounded bg-indigo-700 hover:bg-indigo-800 text-white shadow"
      >
        🔄 Regenerate Today’s Target
      </button>

      <TodayTargetCard target={target} />
    </div>
  );
}

export default TodaysPage;
