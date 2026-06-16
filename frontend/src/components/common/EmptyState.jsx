import React from 'react';

export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-slate-800">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
