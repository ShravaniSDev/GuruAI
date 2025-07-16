// src/features/todaysTarget/generator.ts

import type { DailyTarget } from './types';
import type { ProtocolSetup, Note } from '../../types/types';

export function generateTodayTarget(
  protocol?: ProtocolSetup,
  notes?: Note[]
): DailyTarget {
  const generatedFor = new Date().toLocaleDateString();

  const description = protocol
    ? `🎯 Priority: ${protocol.priority} — ${protocol.why}`
    : '🧭 No protocol found. You can reflect, review past notes, or set a small habit today.';

  const focusArea = protocol?.actions?.length
    ? protocol.actions.join(', ')
    : 'Self-awareness + Simplicity';

  const recentNote = notes && notes.length > 0 ? notes[0] : null;

  const motivation = recentNote?.text
    ? `📝 Inspired by your recent note: "${recentNote.text.slice(0, 60)}..."`
    : '✨ You’re one decision away from a different life 🚀';

  return {
    title: '📌 Today’s Focus',
    generatedFor,
    description,
    focusArea,
    motivation,
  };
}
