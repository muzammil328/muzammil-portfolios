'use client';

export function StatCardSkeleton() {
  return (
    <div className="p-6 rounded-lg border border-slate-200 dark:border-gray-800 animate-pulse">
      <div className="space-y-3">
        <div className="h-8 w-1/3 bg-slate-200 dark:bg-gray-800 rounded" />
        <div className="h-10 w-1/2 bg-slate-200 dark:bg-gray-800 rounded" />
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-gray-800 rounded" />
      </div>
    </div>
  );
}
