import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce.js';

export function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const debouncedQuery = useDebounce(query, 350);

  React.useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search by keyword..."
        className="w-full rounded-3xl border border-slate-200 bg-white py-3 pl-12 pr-4 text-sm text-slate-900 shadow-sm transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      />
    </div>
  );
}
