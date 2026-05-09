import Navbar from '@/components/Navbar';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="h-14 w-64 md:w-80 bg-muted rounded mb-12 animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="rounded-3xl border border-border/70 bg-card p-6 animate-pulse"
              >
                <div className="aspect-video rounded-2xl bg-muted mb-6" />
                <div className="h-8 w-3/4 bg-muted rounded mb-3" />
                <div className="h-4 w-full bg-muted rounded mb-2" />
                <div className="h-4 w-4/5 bg-muted rounded" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
