import React, { useState } from 'react';

export function Tabs({ items = [], defaultIndex = 0 }) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-3xl bg-slate-100 p-2 dark:bg-slate-800">
        {items.map((item, index) => (
          <button
            type="button"
            key={item.label}
            onClick={() => setActiveIndex(index)}
            className={`rounded-2xl px-4 py-2 text-sm font-medium transition ${activeIndex === index ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-900 dark:text-white' : 'text-slate-600 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700'}`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div>{items[activeIndex]?.content}</div>
    </div>
  );
}
