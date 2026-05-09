import type { Metadata } from 'next';
import Link from 'next/link';
import { getAnalyticsSummary } from '@/lib/analytics';
import { requireAdminSessionUser } from '@/lib/auth/serverPageAuth';

type DashboardSearchParams = Record<string, string | string[] | undefined>;

export const metadata: Metadata = {
  title: 'Admin Analytics',
  description: 'Private dashboard for unique visitor and event analytics.',
  robots: {
    index: false,
    follow: false,
  },
};

function firstParam(params: DashboardSearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function toDurationLabel(ms: number) {
  if (!ms || ms <= 0) return '0s';
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const rem = seconds % 60;
  return `${mins}m ${rem}s`;
}

function buildFilterHref(days: number) {
  return `/dashboard/admin/analytics?days=${days}`;
}

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  await requireAdminSessionUser();

  const params = await searchParams;

  const daysParam = Number(firstParam(params, 'days') || '30');
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 90) : 30;

  let summary = null as Awaited<ReturnType<typeof getAnalyticsSummary>> | null;
  let errorMessage = '';

  try {
    summary = await getAnalyticsSummary(days);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Failed to load analytics';
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-300 mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Unique visitors, page engagement, and user journey analytics for public pages.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/admin/leads"
              className="rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              Leads Dashboard
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-border/70 bg-card p-4 flex flex-wrap items-center gap-2">
          {[7, 14, 30, 60, 90].map(range => (
            <Link
              key={range}
              href={buildFilterHref(range)}
              className={`rounded-full border px-3 py-1 text-xs ${days === range ? 'border-primary bg-primary/10 text-primary' : 'border-border/70 hover:bg-muted'}`}
            >
              Last {range}d
            </Link>
          ))}
        </section>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
            {errorMessage}
          </div>
        ) : null}

        {summary ? (
          <>
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <article className="rounded-2xl border border-border/70 bg-card p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Unique Visitors
                </p>
                <p className="text-3xl font-bold mt-2">{summary.uniqueVisitors}</p>
              </article>
              <article className="rounded-2xl border border-border/70 bg-card p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Sessions</p>
                <p className="text-3xl font-bold mt-2">{summary.sessions}</p>
              </article>
              <article className="rounded-2xl border border-border/70 bg-card p-5">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Range</p>
                <p className="text-3xl font-bold mt-2">{summary.rangeDays}d</p>
              </article>
            </section>

            <section className="rounded-2xl border border-border/70 bg-card p-4">
              <h2 className="text-lg font-semibold mb-3">Page Performance</h2>
              {summary.pages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No page data yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-border/70">
                      <tr>
                        <th className="text-left p-2">Path</th>
                        <th className="text-left p-2">Views</th>
                        <th className="text-left p-2">Unique</th>
                        <th className="text-left p-2">Avg Time</th>
                        <th className="text-left p-2">Total Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.pages.map(page => (
                        <tr key={page.path} className="border-b border-border/40">
                          <td className="p-2">{page.path}</td>
                          <td className="p-2">{page.views}</td>
                          <td className="p-2">{page.uniqueVisitors}</td>
                          <td className="p-2">{toDurationLabel(page.avgDurationMs)}</td>
                          <td className="p-2">{toDurationLabel(page.totalDurationMs)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <article className="rounded-2xl border border-border/70 bg-card p-4">
                <h2 className="text-lg font-semibold mb-3">Top Events</h2>
                {summary.topEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events recorded yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {summary.topEvents.slice(0, 12).map((event, idx) => (
                      <li
                        key={`${event.eventType}-${event.path}-${event.label}-${idx}`}
                        className="text-sm"
                      >
                        <span className="font-medium">{event.count}</span> × {event.eventType}
                        {event.label ? ` (${event.label})` : ''} on {event.path}
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              <article className="rounded-2xl border border-border/70 bg-card p-4">
                <h2 className="text-lg font-semibold mb-3">Recent Journeys</h2>
                {summary.journeys.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No journey data yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {summary.journeys.slice(0, 8).map(journey => (
                      <li key={journey.sessionId} className="text-sm">
                        <p className="font-medium">Session {journey.sessionId.slice(0, 10)}...</p>
                        <p className="text-muted-foreground wrap-break-word">
                          {journey.pathSequence.join(' -> ') || '-'}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
