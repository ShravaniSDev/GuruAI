import React, { useEffect, useState } from 'react';
import TodayTargetCard from './TodayTargetCard';
import { generateTodayTarget } from './generator';
import type { DailyTarget } from './types';

const STORAGE_KEY = 'today_target';

function TodaysPage() {
  const [target, setTarget] = useState<DailyTarget | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as DailyTarget;
      const today = new Date().toLocaleDateString();
      if (parsed.generatedFor === today) {
        setTarget(parsed);
        return;
      }
    }

    const newTarget = generateTodayTarget();
    setTarget(newTarget);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTarget));
  }, []);

  // ✅ Regenerate Button Handler
  const handleRegenerate = () => {
    const newTarget = generateTodayTarget();
    setTarget(newTarget);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTarget));
  };

  if (!target) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">🎯 Today’s Target</h1>

      {/* ✅ Regenerate Button */}
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
