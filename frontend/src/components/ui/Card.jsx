import React from 'react';

export function Card({ title, description, footer, className = '', children }) {
  return (
    <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900 ${className}`}>
      {(title || description) && (
        <div className="mb-4">
          {title && <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>}
          {description && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <div>{children}</div>
      {footer && <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">{footer}</div>}
    </div>
  );
}
