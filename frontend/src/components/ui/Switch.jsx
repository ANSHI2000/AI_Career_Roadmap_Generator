import React from 'react';

export function Switch({ checked, label, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700 transition dark:bg-slate-800 dark:text-slate-200">
      <span>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${checked ? 'bg-brand-600' : 'bg-slate-300'}`}
        aria-pressed={checked}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </label>
  );
}
