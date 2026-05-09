import Navbar from '@/components/Navbar';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 md:h-12 w-4/5 bg-muted rounded mb-4 animate-pulse" />

            <div className="flex items-center gap-4 mb-8">
              <div className="h-5 w-28 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-40 bg-muted rounded animate-pulse" />
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse" />
              <div className="h-5 w-32 bg-muted rounded animate-pulse" />
            </div>

            <div className="w-full h-75 md:h-100 bg-muted rounded-lg mb-8 animate-pulse" />

            <div className="space-y-5">
              <div className="h-5 w-full bg-muted rounded animate-pulse" />
              <div className="h-5 w-11/12 bg-muted rounded animate-pulse" />
              <div className="h-5 w-10/12 bg-muted rounded animate-pulse" />

              <div className="h-7 w-2/5 bg-muted rounded mt-8 animate-pulse" />
              <div className="h-5 w-full bg-muted rounded animate-pulse" />
              <div className="h-5 w-4/5 bg-muted rounded animate-pulse" />

              <div className="rounded-xl border border-border/70 bg-card p-5 mt-8">
                <div className="h-5 w-11/12 bg-muted rounded mb-3 animate-pulse" />
                <div className="h-5 w-10/12 bg-muted rounded animate-pulse" />
              </div>

              <div className="h-5 w-full bg-muted rounded animate-pulse" />
              <div className="h-5 w-9/12 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
