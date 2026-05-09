'use client';

export function HeroSectionSkeleton() {
  return (
    <section className="container mx-auto md:py-16 sm:py-8 py-4 px-2 animate-pulse">
      <div className="flex items-center justify-center text-left flex-col py-1">
        <div className="h-4 w-28 bg-muted rounded mb-2" />
        <div className="h-4 w-52 bg-muted rounded mb-3" />
        <div className="h-1 w-44 bg-muted rounded" />
      </div>

      <div className="flex flex-col lg:flex-row items-center lg:gap-24 gap-12 mt-8">
        <div className="w-full lg:w-2/3 mt-12 z-10">
          <div className="h-9 w-72 bg-muted rounded mb-4" />
          <div className="h-14 md:h-20 w-full max-w-2xl bg-muted rounded mb-3" />
          <div className="h-14 md:h-20 w-64 bg-muted rounded" />

          <div className="mt-6 h-8 w-80 bg-muted rounded" />

          <div className="mt-6 space-y-3">
            <div className="h-4 w-full max-w-2xl bg-muted rounded" />
            <div className="h-4 w-4/5 max-w-2xl bg-muted rounded" />
          </div>

          <div className="mt-8 flex flex-col gap-6">
            <div className="h-12 w-52 bg-muted rounded-full" />

            <div className="lg:hidden block max-w-md">
              <div className="h-5 w-24 bg-muted rounded mb-3" />
              <div className="flex items-center gap-3 my-2">
                <div className="w-9 h-9 rounded-full bg-muted" />
                <div className="w-9 h-9 rounded-full bg-muted" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end z-0">
          <div className="w-104 h-104 max-w-full bg-muted rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
