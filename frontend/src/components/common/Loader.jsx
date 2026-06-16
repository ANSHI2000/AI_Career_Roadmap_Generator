import React from 'react';

export function Loader({ fullScreen = false }) {
  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50' : 'flex items-center justify-center'} p-4`}>
      <div className="flex items-center gap-3 rounded-3xl bg-white px-6 py-4 shadow-soft dark:bg-slate-900">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Loading...</span>
      </div>
    </div>
  );
}
