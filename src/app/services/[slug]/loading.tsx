import Navbar from '@/components/Navbar';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="aspect-square rounded-3xl bg-muted mb-8 animate-pulse" />
            </div>

            <div>
              <div className="h-14 md:h-20 w-4/5 bg-muted rounded mb-6 animate-pulse" />
              <div className="h-5 w-full bg-muted rounded mb-2 animate-pulse" />
              <div className="h-5 w-11/12 bg-muted rounded mb-8 animate-pulse" />

              <div className="flex flex-wrap gap-2 mb-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-7 w-28 bg-muted rounded-full animate-pulse" />
                ))}
              </div>

              <div className="mb-8">
                <div className="h-4 w-24 bg-muted rounded mb-4 animate-pulse" />
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-6 w-3/4 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              </div>

              <div>
                <div className="h-4 w-28 bg-muted rounded mb-4 animate-pulse" />
                <div className="flex flex-wrap gap-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-9 w-24 bg-muted rounded-full animate-pulse" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <section className="mt-14 rounded-3xl border border-border/70 p-8 bg-card">
            <div className="h-10 w-56 bg-muted rounded mb-6 animate-pulse" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-8 w-32 bg-muted rounded-full animate-pulse" />
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-3xl border border-border/70 p-8 bg-card">
            <div className="h-10 w-52 bg-muted rounded mb-6 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map(i => (
                <div key={i} className="rounded-2xl border border-border/60 p-5">
                  <div className="h-4 w-16 bg-muted rounded mb-3 animate-pulse" />
                  <div className="h-6 w-2/3 bg-muted rounded mb-3 animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-4 w-4/5 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10 rounded-3xl border border-primary/30 bg-linear-to-r from-primary/10 via-primary/5 to-transparent p-8">
            <div className="h-4 w-28 bg-muted rounded mb-3 animate-pulse" />
            <div className="h-9 w-2/3 bg-muted rounded mb-3 animate-pulse" />
            <div className="h-5 w-4/5 bg-muted rounded mb-6 animate-pulse" />
            <div className="flex flex-wrap gap-3">
              <div className="h-10 w-44 bg-muted rounded-full animate-pulse" />
              <div className="h-10 w-40 bg-muted rounded-full animate-pulse" />
            </div>
          </section>

          <section className="mt-20">
            <div className="h-11 w-72 bg-muted rounded mb-8 animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl border border-border/70 bg-card p-6">
                  <div className="aspect-video bg-muted rounded-xl mb-4 animate-pulse" />
                  <div className="h-7 w-3/4 bg-muted rounded mb-3 animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
