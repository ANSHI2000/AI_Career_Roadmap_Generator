import React from 'react';

export const Select = React.forwardRef(({ label, error, options = [], className = '', ...props }, ref) => {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span className="mb-2 block">{label}</span>}
      <select
        ref={ref}
        className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </label>
  );
});
Select.displayName = 'Select';
