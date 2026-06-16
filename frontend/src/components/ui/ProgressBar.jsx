import React from 'react';

export function ProgressBar({ percentage = 0, label }) {
  return (
    <div className="space-y-2">
      {label && <div className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200"><span>{label}</span><span>{percentage}%</span></div>}
      <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
