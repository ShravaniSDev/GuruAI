// src/types/types.ts

export interface Note {
  id: string;
  text: string;
  tags: string[];
  mood?: string;
  timestamp: string;
}

export interface ProtocolSetup {
  priority: string;
  why: string;
  actions: string[];
  avoid: string[];
}

export type GuruScoreLog = Record<string, number>;

export interface GuruBackup {
  notes?: Note[];
  protocol?: ProtocolSetup;
  score_log?: GuruScoreLog;
}
