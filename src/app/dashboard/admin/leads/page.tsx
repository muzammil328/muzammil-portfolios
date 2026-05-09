import { listContactForms } from '@/lib/contactForms';
import { requireAdminSessionUser } from '@/lib/auth/serverPageAuth';

type LeadRow = {
  id: string;
  created_at: string;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  service_interested?: string | null;
  project_type?: string | null;
  budget_range?: string | null;
  desired_timeline?: string | null;
  project_reference?: string | null;
  page_path?: string | null;
  lead_source?: string | null;
  lead_score?: number | null;
  lead_band?: string | null;
  lead_priority?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  message: string;
};

type DashboardSearchParams = Record<string, string | string[] | undefined>;

const PRIORITY_FILTERS = ['all', 'P1', 'P2', 'P3'] as const;
const SOURCE_FILTERS = ['all', 'home', 'service-detail', 'portfolio-detail', 'other'] as const;

function firstParam(params: DashboardSearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

function buildQueryString(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') return;
    query.set(key, String(value));
  });
  return query.toString();
}

function toReadableDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

async function fetchLeads(filters: {
  priority: string;
  source: string;
  page: number;
  pageSize: number;
}) {
  const result = await listContactForms(filters);

  return {
    rows: result.rows as LeadRow[],
    totalCount: result.totalCount,
    fallbackMode: false,
  };
}

export const metadata = {
  title: 'Admin Leads',
  description: 'Private dashboard for viewing and triaging portfolio leads.',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<DashboardSearchParams>;
}) {
  await requireAdminSessionUser();

  const params = await searchParams;

  const priorityParam = firstParam(params, 'priority') || 'all';
  const sourceParam = firstParam(params, 'source') || 'all';
  const pageParam = Number(firstParam(params, 'page') || '1');
  const pageSizeParam = Number(firstParam(params, 'pageSize') || '25');

  const priority = PRIORITY_FILTERS.includes(priorityParam as (typeof PRIORITY_FILTERS)[number])
    ? priorityParam
    : 'all';
  const source = SOURCE_FILTERS.includes(sourceParam as (typeof SOURCE_FILTERS)[number])
    ? sourceParam
    : 'all';
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const pageSize = Number.isFinite(pageSizeParam) ? Math.min(Math.max(pageSizeParam, 10), 100) : 25;

  let leads: LeadRow[] = [];
  let totalCount = 0;
  let fallbackMode = false;
  let errorMessage = '';

  try {
    const result = await fetchLeads({ priority, source, page, pageSize });
    leads = result.rows;
    totalCount = result.totalCount;
    fallbackMode = result.fallbackMode;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : 'Failed to fetch leads';
  }

  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1);
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  const exportQuery = buildQueryString({
    priority: priority !== 'all' ? priority : undefined,
    source: source !== 'all' ? source : undefined,
  });

  const previousLink =
    '/dashboard/admin/leads?' + buildQueryString({ priority, source, page: page - 1, pageSize });
  const nextLink =
    '/dashboard/admin/leads?' + buildQueryString({ priority, source, page: page + 1, pageSize });

  const filterBaseQuery = {
    pageSize,
    page: 1,
  };

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-300 mx-auto space-y-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sorted by priority (P1, P2, P3) then newest submissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/api/admin/leads/export?${exportQuery}`}
              className="rounded-full border border-border/70 px-3 py-1.5 text-xs font-medium hover:bg-muted"
            >
              Export CSV
            </a>
            <div className="rounded-full border border-border/70 px-3 py-1.5 text-xs text-muted-foreground">
              Total: {totalCount}
            </div>
          </div>
        </header>

        <section className="rounded-2xl border border-border/70 bg-card p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Priority</p>
            {PRIORITY_FILTERS.map(item => {
              const href =
                '/dashboard/admin/leads?' +
                buildQueryString({ ...filterBaseQuery, priority: item, source, page: 1 });

              return (
                <a
                  key={`priority-${item}`}
                  href={href}
                  className={`rounded-full border px-3 py-1 text-xs ${priority === item ? 'border-primary bg-primary/10 text-primary' : 'border-border/70 hover:bg-muted'}`}
                >
                  {item === 'all' ? 'All' : item}
                </a>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Source</p>
            {SOURCE_FILTERS.map(item => {
              const href =
                '/dashboard/admin/leads?' +
                buildQueryString({ ...filterBaseQuery, source: item, priority, page: 1 });

              return (
                <a
                  key={`source-${item}`}
                  href={href}
                  className={`rounded-full border px-3 py-1 text-xs ${source === item ? 'border-primary bg-primary/10 text-primary' : 'border-border/70 hover:bg-muted'}`}
                >
                  {item}
                </a>
              );
            })}
          </div>

          {fallbackMode ? (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Running in fallback mode. Migration columns are not available yet.
            </p>
          ) : null}
        </section>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-300">
            {errorMessage}
          </div>
        ) : null}

        {!errorMessage && leads.length === 0 ? (
          <div className="rounded-2xl border border-border/70 bg-card p-6 text-sm text-muted-foreground">
            No leads yet.
          </div>
        ) : null}

        {!errorMessage && leads.length > 0 ? (
          <>
            <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card">
              <table className="w-full text-sm">
                <thead className="border-b border-border/70 bg-muted/30">
                  <tr>
                    <th className="text-left p-3">When</th>
                    <th className="text-left p-3">Priority</th>
                    <th className="text-left p-3">Lead</th>
                    <th className="text-left p-3">Contact</th>
                    <th className="text-left p-3">Qualification</th>
                    <th className="text-left p-3">Message</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id} className="border-b border-border/40 align-top">
                      <td className="p-3 whitespace-nowrap">{toReadableDate(lead.created_at)}</td>
                      <td className="p-3">
                        <div className="space-y-1">
                          <p className="font-semibold">{lead.lead_priority || '-'}</p>
                          <p className="text-xs text-muted-foreground">
                            {lead.lead_score || '-'} / 100
                          </p>
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-medium">
                          {lead.fname} {lead.lname}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {lead.lead_band || 'Unscored'}
                        </p>
                      </td>
                      <td className="p-3">
                        <p>{lead.email}</p>
                        <p className="text-xs text-muted-foreground">{lead.phone}</p>
                      </td>
                      <td className="p-3">
                        <div className="space-y-1 text-xs">
                          {lead.service_interested ? (
                            <p>Service: {lead.service_interested}</p>
                          ) : null}
                          {lead.project_type ? <p>Type: {lead.project_type}</p> : null}
                          {lead.budget_range ? <p>Budget: {lead.budget_range}</p> : null}
                          {lead.desired_timeline ? <p>Timeline: {lead.desired_timeline}</p> : null}
                          {lead.lead_source ? <p>Source: {lead.lead_source}</p> : null}
                          {lead.utm_source ? <p>UTM: {lead.utm_source}</p> : null}
                        </div>
                      </td>
                      <td className="p-3 max-w-sm">
                        <p className="line-clamp-4 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground">
                          {lead.message}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Page {page} of {totalPages} · {pageSize} per page
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={hasPrevious ? previousLink : '#'}
                  aria-disabled={!hasPrevious}
                  className={`rounded-full border px-3 py-1.5 text-xs ${hasPrevious ? 'border-border/70 hover:bg-muted' : 'border-border/40 text-muted-foreground/60 pointer-events-none'}`}
                >
                  Previous
                </a>
                <a
                  href={hasNext ? nextLink : '#'}
                  aria-disabled={!hasNext}
                  className={`rounded-full border px-3 py-1.5 text-xs ${hasNext ? 'border-border/70 hover:bg-muted' : 'border-border/40 text-muted-foreground/60 pointer-events-none'}`}
                >
                  Next
                </a>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
