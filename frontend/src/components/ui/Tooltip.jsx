import React from 'react';

export function Tooltip({ content, children }) {
  return (
    <span className="group relative inline-block">
      {children}
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-max -translate-x-1/2 rounded-xl border border-slate-200 bg-slate-950 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
        {content}
      </span>
    </span>
  );
}
