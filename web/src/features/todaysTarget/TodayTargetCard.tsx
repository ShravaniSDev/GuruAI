import React from 'react';
import type { DailyTarget } from './types';

interface Props {
  target: DailyTarget;
}

const TodayTargetCard: React.FC<Props> = ({ target }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-6 shadow-lg space-y-3">
      <h2 className="text-2xl font-bold">{target.title}</h2>
      {target.subtitle && <p className="text-sm italic text-indigo-100">{target.subtitle}</p>}
      <p className="text-lg">{target.description}</p>
      <div className="bg-white text-black p-2 rounded shadow">
        <strong>Focus:</strong> {target.focusArea}
      </div>
      <div className="italic text-yellow-200">✨ {target.motivation}</div>
    </div>
  );
};

export default TodayTargetCard;
