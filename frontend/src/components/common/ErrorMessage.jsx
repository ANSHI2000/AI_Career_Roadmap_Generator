import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function ErrorMessage({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-slate-700 dark:border-red-700 dark:bg-slate-950 dark:text-slate-200">
      <div className="flex items-center gap-4">
        <AlertTriangle className="h-6 w-6 text-red-600" />
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-4">
          <Button variant="secondary" onClick={onRetry}>Retry</Button>
        </div>
      )}
    </div>
  );
}
