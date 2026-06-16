import React from 'react';

export function Dialog({ isOpen, title, description, onClose, actions, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
            Close
          </button>
        </div>
        <div className="mt-6">{children}</div>
        {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </div>
  );
}
