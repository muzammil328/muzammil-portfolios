import Navbar from '@/components/Navbar';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="h-14 w-72 md:w-96 bg-muted rounded mb-12 animate-pulse" />

          <section className="rounded-2xl border border-border/70 bg-card p-4 md:p-5 mb-8 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 rounded-md bg-muted" />
              ))}
            </div>
          </section>

          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-border/70 bg-card p-6 animate-pulse"
              >
                <div className="h-8 w-2/5 bg-muted rounded mb-3" />
                <div className="h-6 w-1/3 bg-muted rounded mb-3" />
                <div className="h-4 w-full bg-muted rounded mb-2" />
                <div className="h-4 w-3/4 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
