import React from 'react';

export function RadioGroup({ label, options = [], name, value, onChange }) {
  return (
    <fieldset className="space-y-3">
      {label && <legend className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</legend>}
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 shadow-sm transition hover:border-brand-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 text-brand-600 focus:ring-brand-500"
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
