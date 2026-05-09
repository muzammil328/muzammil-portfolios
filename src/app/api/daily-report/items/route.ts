import { NextRequest, NextResponse } from 'next/server';
import { requireFeature } from '@/lib/auth/guards';
import { createDailyReportItem, listDailyReportItems } from '@/lib/dailyReport';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const payload = await requireFeature(req, 'daily_report');
  if (payload instanceof NextResponse) return payload;

  const isAdmin = payload.role === 'admin';
  const userId = isAdmin ? undefined : payload.user_id;

  try {
    const items = await listDailyReportItems(userId, isAdmin);
    return NextResponse.json(items);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch report items';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const payload = await requireFeature(req, 'daily_report');
  if (payload instanceof NextResponse) return payload;

  const isAdmin = payload.role === 'admin';
  const userId = isAdmin ? undefined : payload.user_id;

  try {
    const body = await req.json();
    const created = await createDailyReportItem(body, userId);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create report item';
    const status = /required|invalid/i.test(message) ? 400 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
