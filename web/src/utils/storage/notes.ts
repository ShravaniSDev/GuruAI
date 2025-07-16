import type { Note } from '../../types/types';

export function loadNotes(): Note[] {
  try {
    const data = localStorage.getItem('guru-notes');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load notes:', e);
    return [];
  }
}
