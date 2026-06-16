import React from 'react';

export const Textarea = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span className="mb-2 block">{label}</span>}
      <textarea
        ref={ref}
        className={`min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${className}`}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </label>
  );
});
Textarea.displayName = 'Textarea';
