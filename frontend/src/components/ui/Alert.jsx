import React from 'react';

const variants = {
  success: 'bg-emerald-100 text-emerald-900 border-emerald-200',
  warning: 'bg-amber-100 text-amber-900 border-amber-200',
  error: 'bg-red-100 text-red-900 border-red-200',
  info: 'bg-sky-100 text-sky-900 border-sky-200',
};

export function Alert({ variant = 'info', title, message }) {
  return (
    <div className={`rounded-3xl border px-4 py-4 text-sm ${variants[variant]}`}>
      {title && <p className="font-semibold">{title}</p>}
      <p className="mt-1">{message}</p>
    </div>
  );
}
