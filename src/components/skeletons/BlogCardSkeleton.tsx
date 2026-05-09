'use client';

export function BlogCardSkeleton() {
  return (
    <div className="rounded-bl-md rounded-br-md mt-5 relative animate-pulse">
      <div className="image relative overflow-hidden w-full h-auto">
        <div className="w-full h-64 bg-slate-200 dark:bg-gray-800 rounded-tl-lg rounded-tr-lg" />
      </div>
      <div className="flex flex-col items-start rounded-bl-md rounded-br-md bg-slate-100 dark:bg-gray-900 px-3 py-5 space-y-3">
        <div className="h-6 w-3/4 bg-slate-200 dark:bg-gray-700 rounded" />
        <div className="flex flex-row gap-4 items-center w-full">
          <div className="h-4 w-24 bg-slate-200 dark:bg-gray-700 rounded" />
          <span className="text-slate-200 dark:text-gray-700"> | </span>
          <div className="h-4 w-20 bg-slate-200 dark:bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}
