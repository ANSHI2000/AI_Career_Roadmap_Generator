import React from 'react';
import { Button } from '../ui/Button.jsx';

export function ConfirmationModal({ isOpen, title, description, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3 justify-end">
          <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
        </div>
      </div>
    </div>
  );
}
