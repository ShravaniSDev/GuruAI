import type { GuruBackup, Note, ProtocolSetup, GuruScoreLog } from '../types/types';


/**
 * Merge notes based on ID and latest timestamp
 */
function mergeNotes(existing: Note[] = [], incoming: Note[] = []): Note[] {
  const map = new Map<string, Note>();
  for (const note of existing) map.set(note.id, note);
  for (const note of incoming) {
    const existingNote = map.get(note.id);
    if (!existingNote || new Date(note.timestamp) > new Date(existingNote.timestamp)) {
      map.set(note.id, note);
    }
  }
  return Array.from(map.values());
}

/**
 * If incoming protocol exists, use it. Else keep existing.
 */
function mergeProtocol(existing?: ProtocolSetup, incoming?: ProtocolSetup): ProtocolSetup | undefined {
  return incoming ?? existing;
}

/**
 * Merge score logs by date, using the higher score
 */
function mergeScoreLog(existing: GuruScoreLog = {}, incoming: GuruScoreLog = {}): GuruScoreLog {
  const result: GuruScoreLog = { ...existing };
  for (const [date, score] of Object.entries(incoming)) {
    result[date] = result[date] !== undefined ? Math.max(result[date], score) : score;
  }
  return result;
}

/**
 * Merge full GuruBackup object
 */
export function mergeGuruBackup(existing: GuruBackup, incoming: GuruBackup): GuruBackup {
  return {
    notes: mergeNotes(existing.notes, incoming.notes),
    protocol: mergeProtocol(existing.protocol, incoming.protocol),
    score_log: mergeScoreLog(existing.score_log, incoming.score_log)
  };
}
