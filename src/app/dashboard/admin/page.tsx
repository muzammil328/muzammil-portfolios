import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdminSessionUser } from '@/lib/auth/serverPageAuth';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Private admin entry point for portfolio lead management.',
  robots: {
    index: false,
    follow: false,
  },
};

const quickLinks = [
  {
    title: 'Leads Dashboard',
    description: 'Review, filter, and export contact submissions.',
    href: '/dashboard/admin/leads',
    action: 'Open leads',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Review unique visitors, journeys, and event engagement.',
    href: '/dashboard/admin/analytics',
    action: 'Open analytics',
  },
  {
    title: 'Task Manager',
    description: 'Plan daily tasks with status updates and recurring workflow.',
    href: '/dashboard/task',
    action: 'Open tasks',
  },
  {
    title: 'Daily Report',
    description: 'Track daily checklist completion and history snapshots.',
    href: '/dashboard/daily-report',
    action: 'Open report',
  },
  {
    title: 'Public site',
    description: 'Jump back to the main portfolio to review public-facing pages.',
    href: '/',
    action: 'Go home',
  },
];

export default async function AdminPage() {
  await requireAdminSessionUser();

  return (
    <main className="min-h-screen bg-background px-6 py-16 md:px-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl border border-border/70 bg-card p-8 md:p-10 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">
                Admin Area
              </p>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">
                Portfolio Operations Center
              </h1>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Use this dashboard to jump into lead triage, inspect submissions, and keep the
                public site separate from private admin workflows.
              </p>
            </div>

            <Link
              href="/dashboard/admin/leads"
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Open Leads Dashboard
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {quickLinks.map(item => (
            <article
              key={item.title}
              className="rounded-2xl border border-border/70 bg-card p-6 transition-colors hover:bg-muted/30"
            >
              <h2 className="text-xl font-bold mb-2">{item.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {item.description}
              </p>
              <Link href={item.href} className="text-sm font-semibold text-primary hover:underline">
                {item.action}
              </Link>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-border/70 bg-muted/20 p-6 md:p-8">
          <h2 className="text-lg font-bold mb-3">How access works</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>1. Login with an admin account.</li>
            <li>2. Open admin tools from this dashboard.</li>
            <li>3. Leads and analytics are admin-only.</li>
            <li>4. Use filters and export to triage leads.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
