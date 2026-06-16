import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="flex items-center justify-between rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 transition disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>
      <div className="text-slate-600 dark:text-slate-300">Page {currentPage} of {totalPages}</div>
      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 transition disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
