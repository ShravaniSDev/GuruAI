import React, { useState } from 'react';
import ImportModal from '../components/ImportModal';
import { mergeGuruBackup } from '../utils/importHelpers';
import type { GuruBackup } from '../types/types';

const Settings: React.FC = () => {
  const [showImportModal, setShowImportModal] = useState(false);

  const handleImportApply = (data: GuruBackup, mode: 'merge' | 'replace') => {
    if (mode === 'replace') {
      if (data.notes) localStorage.setItem('guru_notes', JSON.stringify(data.notes));
      if (data.protocol) localStorage.setItem('guru_protocol', JSON.stringify(data.protocol));
      if (data.score_log) localStorage.setItem('guru_score_log', JSON.stringify(data.score_log));
    } else if (mode === 'merge') {
      const existing = {
        notes: JSON.parse(localStorage.getItem('guru_notes') || '[]'),
        protocol: JSON.parse(localStorage.getItem('guru_protocol') || '{}'),
        score_log: JSON.parse(localStorage.getItem('guru_score_log') || '{}'),
      };
      const merged = mergeGuruBackup(existing, data);
      if (merged.notes) localStorage.setItem('guru_notes', JSON.stringify(merged.notes));
      if (merged.protocol) localStorage.setItem('guru_protocol', JSON.stringify(merged.protocol));
      if (merged.score_log) localStorage.setItem('guru_score_log', JSON.stringify(merged.score_log));
    }

    alert('✅ Backup imported successfully!');
  };

  const handleExport = () => {
    const backup: GuruBackup = {
      notes: JSON.parse(localStorage.getItem('guru_notes') || '[]'),
      protocol: JSON.parse(localStorage.getItem('guru_protocol') || '{}'),
      score_log: JSON.parse(localStorage.getItem('guru_score_log') || '{}'),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `guru-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  const handleReset = () => {
    if (confirm('⚠️ Are you sure you want to reset all your data?')) {
      localStorage.removeItem('guru_notes');
      localStorage.removeItem('guru_protocol');
      localStorage.removeItem('guru_score_log');
      alert('🧹 All data has been cleared.');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">⚙️ Settings</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">📦 Data Management</h2>

        <button
          onClick={() => setShowImportModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
        >
          📂 Import Backup
        </button>

        <button
          onClick={handleExport}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition"
        >
          📤 Export Backup
        </button>

        <button
          onClick={handleReset}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition"
        >
          🗑️ Reset All Data
        </button>
      </div>

      <ImportModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onApply={handleImportApply}
      />
    </div>
  );
};

export default Settings;
