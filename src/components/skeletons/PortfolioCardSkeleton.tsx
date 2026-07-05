'use client';

export function PortfolioCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div className="h-full animate-pulse">
      <div className="group h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300">
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-200 dark:bg-gray-800 rounded-t-2xl" />

        {/* Content Section */}
        <div className="flex flex-col p-6 space-y-4">
          {/* Category Badge */}
          <div className="flex gap-2">
            <div className="h-6 w-20 bg-slate-200 dark:bg-gray-800 rounded-full" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 w-4/5 bg-slate-200 dark:bg-gray-800 rounded" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-200 dark:bg-gray-800 rounded" />
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-gray-800 rounded" />
          </div>

          {/* Skills/Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-6 w-16 bg-slate-200 dark:bg-gray-800 rounded-full" />
            ))}
          </div>

          {/* Links */}
          <div className="flex gap-2 pt-2">
            <div className="h-8 w-8 bg-slate-200 dark:bg-gray-800 rounded" />
            <div className="h-8 w-8 bg-slate-200 dark:bg-gray-800 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
