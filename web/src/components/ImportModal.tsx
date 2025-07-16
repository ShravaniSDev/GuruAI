import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import type { GuruBackup } from '../types/types';

type ImportMode = 'merge' | 'replace';

interface ImportModalProps {
  open: boolean;
  onClose: () => void;
  onApply: (data: GuruBackup, mode: ImportMode) => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ open, onClose, onApply }) => {
  const [importData, setImportData] = useState<GuruBackup | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('merge');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string) as GuruBackup;
        setImportData(parsed);
        setError(null);
      } catch (err) {
        setError('Invalid JSON format. Please upload a valid .json file.');
      }
    };
    reader.readAsText(file);
  };

  const handleApply = () => {
    if (importData) {
      onApply(importData, importMode);
      onClose();
    } else {
      setError('No data to import.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {/* ✅ Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-40" aria-hidden="true" />

      {/* ✅ Panel */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-lg w-full shadow-lg">
          <Dialog.Title className="text-xl font-semibold mb-4 text-center">📂 Import Guru Backup</Dialog.Title>

          <input
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="mb-4 w-full border border-gray-300 dark:border-gray-600 p-2 rounded"
          />

          {error && <p className="text-red-500 mb-2">{error}</p>}

          {importData && (
            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-4 text-sm">
              <p><strong>Notes:</strong> {importData.notes?.length || 0}</p>
              <p><strong>Protocol:</strong> {importData.protocol?.priority ? '✔️ Present' : '❌ Missing'}</p>
              <p><strong>Score Entries:</strong> {importData.score_log ? Object.keys(importData.score_log).length : 0}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block font-medium mb-1">🛠 Import Mode</label>
            <div className="space-y-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                  className="mr-2"
                />
                Merge with existing data
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mr-2"
                />
                Replace all existing data
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white">
              Cancel
            </button>
            <button onClick={handleApply} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
              Apply Import
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ImportModal;
