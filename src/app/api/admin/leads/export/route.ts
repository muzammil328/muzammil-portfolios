import { NextRequest, NextResponse } from 'next/server';
import { requireAdminRole } from '@/lib/auth/guards';
import { exportContactForms } from '@/lib/contactForms';

type LeadRow = {
  id: string | number;
  created_at: string;
  lead_priority: string | null;
  lead_score: number | null;
  lead_band: string | null;
  lead_source: string | null;
  fname: string;
  lname: string;
  email: string;
  phone: string;
  service_interested: string | null;
  project_type: string | null;
  budget_range: string | null;
  desired_timeline: string | null;
  project_reference: string | null;
  page_path: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  message: string;
};

function csvEscape(value: unknown) {
  const text = String(value ?? '');
  if (text.includes('"') || text.includes(',') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(rows: LeadRow[]) {
  const headers = [
    'id',
    'created_at',
    'lead_priority',
    'lead_score',
    'lead_band',
    'lead_source',
    'fname',
    'lname',
    'email',
    'phone',
    'service_interested',
    'project_type',
    'budget_range',
    'desired_timeline',
    'project_reference',
    'page_path',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'message',
  ];

  const lines = [headers.join(',')];

  rows.forEach(row => {
    const values = [
      row.id,
      row.created_at,
      row.lead_priority,
      row.lead_score,
      row.lead_band,
      row.lead_source,
      row.fname,
      row.lname,
      row.email,
      row.phone,
      row.service_interested,
      row.project_type,
      row.budget_range,
      row.desired_timeline,
      row.project_reference,
      row.page_path,
      row.utm_source,
      row.utm_medium,
      row.utm_campaign,
      row.message,
    ];

    lines.push(values.map(csvEscape).join(','));
  });

  return lines.join('\n');
}

export async function GET(req: NextRequest) {
  const payload = await requireAdminRole(req);
  if (payload instanceof NextResponse) return payload;

  const priority = req.nextUrl.searchParams.get('priority') || 'all';
  const source = req.nextUrl.searchParams.get('source') || 'all';

  try {
    const rows = await exportContactForms({ priority, source });
    const csv = toCsv(rows);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to export leads';
    return NextResponse.json({ message }, { status: 500 });
  }
}
