import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.title} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              <span>{item.title}</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="border-t border-slate-200 px-5 py-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
