import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { trackAnalyticsEvent } from '@/lib/analytics';

export const runtime = 'nodejs';

const analyticsEventSchema = z.object({
  visitorId: z.string().trim().min(8).max(128),
  sessionId: z.string().trim().min(8).max(128),
  path: z.string().trim().min(1).max(200),
  eventType: z.enum([
    'page_view',
    'route_change',
    'time_spent',
    'scroll_depth',
    'cta_click',
    'outbound_click',
    'form_start',
    'form_submit',
  ]),
  eventLabel: z.string().trim().max(200).optional(),
  durationMs: z
    .number()
    .int()
    .min(0)
    .max(60 * 60 * 1000)
    .optional(),
  scrollPercent: z.number().min(0).max(100).optional(),
  referrer: z.string().trim().max(500).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const payloadSchema = z.object({
  events: z.array(analyticsEventSchema).min(1).max(20),
});

function getIpAddress(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || null;
  }

  const realIp = req.headers.get('x-real-ip');
  return realIp?.trim() || null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsed.error.issues[0]?.message || 'Invalid analytics payload',
        },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get('user-agent');
    const ip = getIpAddress(req);

    let accepted = 0;
    let dropped = 0;
    let lastError: string | null = null;

    // Process batched events sequentially to avoid session upsert race conditions.
    for (const event of parsed.data.events) {
      try {
        await trackAnalyticsEvent(event, {
          userAgent,
          ip,
        });
        accepted += 1;
      } catch (error) {
        dropped += 1;
        lastError = error instanceof Error ? error.message : 'Failed to write analytics event';
      }
    }

    if (dropped > 0) {
      return NextResponse.json(
        {
          success: true,
          accepted,
          dropped,
          message: lastError || 'Some analytics events were dropped',
        },
        { status: 202 }
      );
    }

    return NextResponse.json({ success: true, accepted, dropped: 0 }, { status: 201 });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : 'Failed to ingest analytics event';
    return NextResponse.json({ success: true, accepted: 0, dropped: 0, message }, { status: 202 });
  }
}
