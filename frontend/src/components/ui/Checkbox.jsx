import React from 'react';

export function Checkbox({ label, checked, ...props }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
      <input type="checkbox" checked={checked} className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500" {...props} />
      <span>{label}</span>
    </label>
  );
}
