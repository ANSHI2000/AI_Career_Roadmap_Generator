import React from 'react';

export const Input = React.forwardRef(({ label, error, icon, className = '', ...props }, ref) => {
  return (
    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200">
      {label && <span className="mb-2 block">{label}</span>}
      <div className="relative">
        {icon && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{icon}</span>}
        <input
          ref={ref}
          className={`w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${icon ? 'pl-11' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </label>
  );
});
Input.displayName = 'Input';
