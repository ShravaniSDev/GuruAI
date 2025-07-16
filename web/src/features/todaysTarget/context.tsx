import React, { createContext, useContext, useEffect, useState } from 'react';
import { generateTodayTarget } from './generator';
import type { DailyTarget } from './types';
import type { ProtocolSetup, Note } from '../../types/types';

// Replace with actual storage utility functions
import { loadProtocol } from '../../utils/storage/protocol';
import { loadNotes } from '../../utils/storage/notes';

interface TodayTargetContextType {
  target: DailyTarget | null;
  refreshTarget: () => void;
}

const TodayTargetContext = createContext<TodayTargetContextType | undefined>(undefined);

export const TodayTargetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [target, setTarget] = useState<DailyTarget | null>(null);

  const refreshTarget = () => {
    const protocol: ProtocolSetup | undefined = loadProtocol();
    const notes: Note[] = loadNotes();
    const generated = generateTodayTarget(protocol, notes);
    setTarget(generated);
  };

  useEffect(() => {
    refreshTarget();
  }, []);

  return (
    <TodayTargetContext.Provider value={{ target, refreshTarget }}>
      {children}
    </TodayTargetContext.Provider>
  );
};

export const useTodayTarget = (): TodayTargetContextType => {
  const context = useContext(TodayTargetContext);
  if (!context) {
    throw new Error('useTodayTarget must be used within a TodayTargetProvider');
  }
  return context;
};
