export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export function EmptyState({ title = 'No data yet', description = 'Create your first item to see it here.', action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ProgressLine({ value = 0 }) {
  return (
    <div className="h-2 rounded-full bg-slate-100">
      <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}
