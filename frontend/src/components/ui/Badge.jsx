import React from 'react';

const badgeClasses = {
  success: 'bg-emerald-100 text-emerald-800',
  warning: 'bg-amber-100 text-amber-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-sky-100 text-sky-800',
  neutral: 'bg-slate-100 text-slate-800',
};

export function Badge({ variant = 'neutral', children, className = '' }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses[variant] || badgeClasses.neutral} ${className}`}>{children}</span>;
}
