import crypto from 'crypto';
import { connectMongo } from '@/lib/mongodb';
import { AnalyticsEventModel, type AnalyticsEventType } from '@/models/AnalyticsEvent';
import { AnalyticsSessionModel } from '@/models/AnalyticsSession';

export type AnalyticsPayload = {
  visitorId: string;
  sessionId: string;
  path: string;
  eventType: AnalyticsEventType;
  eventLabel?: string;
  durationMs?: number;
  scrollPercent?: number;
  referrer?: string;
  metadata?: Record<string, unknown>;
};

function hashIp(ip: string) {
  const salt = process.env.ANALYTICS_HASH_SALT || 'analytics-default-salt';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

function normalizePath(path: string) {
  if (!path.startsWith('/')) return '/';
  return path.slice(0, 200);
}

export async function trackAnalyticsEvent(
  payload: AnalyticsPayload,
  requestInfo: { userAgent?: string | null; ip?: string | null }
) {
  await connectMongo();

  const eventDoc = {
    visitor_id: payload.visitorId,
    session_id: payload.sessionId,
    path: normalizePath(payload.path),
    event_type: payload.eventType,
    event_label: payload.eventLabel || null,
    duration_ms: typeof payload.durationMs === 'number' ? payload.durationMs : null,
    scroll_percent: typeof payload.scrollPercent === 'number' ? payload.scrollPercent : null,
    referrer: payload.referrer || null,
    user_agent: requestInfo.userAgent || null,
    ip_hash: requestInfo.ip ? hashIp(requestInfo.ip) : null,
    metadata: payload.metadata || null,
  };

  await AnalyticsEventModel.create(eventDoc);

  const inc: Record<string, number> = { event_count: 1 };
  if (eventDoc.event_type === 'time_spent' && eventDoc.duration_ms && eventDoc.duration_ms > 0) {
    inc.total_tracked_ms = Math.min(eventDoc.duration_ms, 10 * 60 * 1000);
  }

  const sessionUpdate = {
    $setOnInsert: {
      visitor_id: payload.visitorId,
      session_id: payload.sessionId,
      entry_path: eventDoc.path,
      started_at: new Date(),
      total_tracked_ms: 0,
      event_count: 0,
    },
    $set: {
      last_path: eventDoc.path,
      last_seen_at: new Date(),
    },
    $inc: inc,
  };

  try {
    await AnalyticsSessionModel.updateOne({ session_id: payload.sessionId }, sessionUpdate, {
      upsert: true,
    });
  } catch (error) {
    const mongoCode = (error as { code?: number })?.code;
    // Another request inserted the same session concurrently. Retry as a plain update.
    if (mongoCode === 11000) {
      await AnalyticsSessionModel.updateOne(
        { session_id: payload.sessionId },
        {
          $set: {
            last_path: eventDoc.path,
            last_seen_at: new Date(),
          },
          $inc: inc,
        }
      );
      return;
    }

    throw error;
  }
}

export async function getAnalyticsSummary(days: number) {
  await connectMongo();

  const now = Date.now();
  const since = new Date(now - Math.max(days, 1) * 24 * 60 * 60 * 1000);

  const [visitorSet, sessionCount, pageViewsByPath, timeSpentByPath, topEvents, journeys] =
    await Promise.all([
      AnalyticsEventModel.distinct('visitor_id', { created_at: { $gte: since } }),
      AnalyticsSessionModel.countDocuments({ last_seen_at: { $gte: since } }),
      AnalyticsEventModel.aggregate([
        { $match: { created_at: { $gte: since }, event_type: 'page_view' } },
        {
          $group: {
            _id: '$path',
            views: { $sum: 1 },
            visitors: { $addToSet: '$visitor_id' },
          },
        },
        {
          $project: {
            _id: 0,
            path: '$_id',
            views: 1,
            uniqueVisitors: { $size: '$visitors' },
          },
        },
        { $sort: { views: -1 } },
        { $limit: 20 },
      ]),
      AnalyticsEventModel.aggregate([
        {
          $match: {
            created_at: { $gte: since },
            event_type: 'time_spent',
            duration_ms: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: '$path',
            avgDurationMs: { $avg: '$duration_ms' },
            totalDurationMs: { $sum: '$duration_ms' },
          },
        },
        {
          $project: {
            _id: 0,
            path: '$_id',
            avgDurationMs: { $round: ['$avgDurationMs', 0] },
            totalDurationMs: 1,
          },
        },
      ]),
      AnalyticsEventModel.aggregate([
        {
          $match: {
            created_at: { $gte: since },
            event_type: {
              $in: ['cta_click', 'outbound_click', 'form_start', 'form_submit', 'scroll_depth'],
            },
          },
        },
        {
          $group: {
            _id: {
              eventType: '$event_type',
              label: '$event_label',
              path: '$path',
            },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            eventType: '$_id.eventType',
            label: '$_id.label',
            path: '$_id.path',
            count: 1,
          },
        },
        { $sort: { count: -1 } },
        { $limit: 25 },
      ]),
      AnalyticsEventModel.aggregate([
        { $match: { created_at: { $gte: since }, event_type: 'page_view' } },
        { $sort: { created_at: 1 } },
        {
          $group: {
            _id: '$session_id',
            visitorId: { $first: '$visitor_id' },
            lastSeenAt: { $last: '$created_at' },
            pathSequence: { $push: '$path' },
          },
        },
        { $sort: { lastSeenAt: -1 } },
        { $limit: 20 },
      ]),
    ]);

  const durationMap = new Map<string, { avgDurationMs: number; totalDurationMs: number }>();
  for (const row of timeSpentByPath) {
    durationMap.set(row.path, {
      avgDurationMs: row.avgDurationMs || 0,
      totalDurationMs: row.totalDurationMs || 0,
    });
  }

  const pages = pageViewsByPath.map(row => {
    const duration = durationMap.get(row.path);
    return {
      path: row.path,
      views: row.views,
      uniqueVisitors: row.uniqueVisitors,
      avgDurationMs: duration?.avgDurationMs || 0,
      totalDurationMs: duration?.totalDurationMs || 0,
    };
  });

  return {
    rangeDays: days,
    uniqueVisitors: visitorSet.length,
    sessions: sessionCount,
    pages,
    topEvents,
    journeys: journeys.map(journey => ({
      sessionId: journey._id,
      visitorId: journey.visitorId,
      lastSeenAt: journey.lastSeenAt,
      pathSequence: Array.isArray(journey.pathSequence) ? journey.pathSequence.slice(0, 12) : [],
    })),
  };
}
