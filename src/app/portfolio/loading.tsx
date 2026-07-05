import Navbar from '@/components/Navbar';

export default function Loading() {
  return (
    <div>
      <Navbar />
      <section className="h-104 flex items-center justify-center">
        <div className="h-14 w-72 bg-muted rounded animate-pulse" />
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full px-4 border-t border-zinc-200 dark:border-zinc-900 gap-4 py-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-2xl border border-border/70 bg-card p-6 animate-pulse">
            <div className="aspect-video rounded-xl bg-muted mb-5" />
            <div className="h-7 w-3/4 bg-muted rounded mb-3" />
            <div className="h-4 w-full bg-muted rounded mb-2" />
            <div className="h-4 w-2/3 bg-muted rounded" />
          </div>
        ))}
      </section>
    </div>
  );
}
