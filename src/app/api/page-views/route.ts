import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getPageViewCount, incrementPageView } from '@/lib/pageViews';

const pageViewSchema = z.object({
  path: z.string().trim().min(1).max(255),
});

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = pageViewSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid path' }, { status: 400 });
    }

    const { path } = parsed.data;
    const count = await incrementPageView(path);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to track view';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const path = req.nextUrl.searchParams.get('path') || '';
    const parsed = pageViewSchema.safeParse({ path });

    if (!parsed.success) {
      return NextResponse.json({ success: false, message: 'Invalid path' }, { status: 400 });
    }

    const count = await getPageViewCount(parsed.data.path);

    return NextResponse.json({ success: true, count });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch views';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
