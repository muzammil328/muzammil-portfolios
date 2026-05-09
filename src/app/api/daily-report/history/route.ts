import { NextRequest, NextResponse } from 'next/server';
import { requireFeature } from '@/lib/auth/guards';
import { listDailyReportHistory, upsertDailyReportHistory } from '@/lib/dailyReport';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const payload = await requireFeature(req, 'daily_report');
  if (payload instanceof NextResponse) return payload;

  // Only admins can view all history
  if (payload.role !== 'admin') {
    return NextResponse.json([]);
  }

  try {
    const history = await listDailyReportHistory();
    return NextResponse.json(history);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch report history';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const payload = await requireFeature(req, 'daily_report');
  if (payload instanceof NextResponse) return payload;

  // Only admins can save history snapshots
  if (payload.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
  }

  try {
    const body = await req.json();
    const saved = await upsertDailyReportHistory(body);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save report history';
    const status = /required|invalid/i.test(message) ? 400 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
