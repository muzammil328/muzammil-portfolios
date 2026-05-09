import { NextRequest, NextResponse } from 'next/server';
import { getAnalyticsSummary } from '@/lib/analytics';
import { requireAdminRole } from '@/lib/auth/guards';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const payload = await requireAdminRole(req);
  if (payload instanceof NextResponse) return payload;

  const daysParam = Number(req.nextUrl.searchParams.get('days') || '30');
  const days = Number.isFinite(daysParam) ? Math.min(Math.max(daysParam, 1), 90) : 30;

  try {
    const summary = await getAnalyticsSummary(days);
    return NextResponse.json({ success: true, data: summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load analytics summary';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
