import mongoose, { Schema, type Model } from 'mongoose';

export type AnalyticsEventType =
  | 'page_view'
  | 'route_change'
  | 'time_spent'
  | 'scroll_depth'
  | 'cta_click'
  | 'outbound_click'
  | 'form_start'
  | 'form_submit';

export interface AnalyticsEventRecord {
  visitor_id: string;
  session_id: string;
  path: string;
  event_type: AnalyticsEventType;
  event_label?: string | null;
  duration_ms?: number | null;
  scroll_percent?: number | null;
  referrer?: string | null;
  user_agent?: string | null;
  ip_hash?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: Date;
}

const AnalyticsEventSchema = new Schema<AnalyticsEventRecord>(
  {
    visitor_id: { type: String, required: true, index: true },
    session_id: { type: String, required: true, index: true },
    path: { type: String, required: true, index: true },
    event_type: {
      type: String,
      required: true,
      enum: [
        'page_view',
        'route_change',
        'time_spent',
        'scroll_depth',
        'cta_click',
        'outbound_click',
        'form_start',
        'form_submit',
      ],
      index: true,
    },
    event_label: { type: String, default: null },
    duration_ms: { type: Number, default: null },
    scroll_percent: { type: Number, default: null },
    referrer: { type: String, default: null },
    user_agent: { type: String, default: null },
    ip_hash: { type: String, default: null },
    metadata: { type: Schema.Types.Mixed, default: null },
    created_at: { type: Date, default: Date.now, index: true },
  },
  {
    versionKey: false,
    collection: 'analytics_events',
  }
);

AnalyticsEventSchema.index({ created_at: -1, path: 1 });
AnalyticsEventSchema.index({ event_type: 1, created_at: -1 });

export const AnalyticsEventModel: Model<AnalyticsEventRecord> =
  (mongoose.models.AnalyticsEvent as Model<AnalyticsEventRecord>) ||
  mongoose.model<AnalyticsEventRecord>('AnalyticsEvent', AnalyticsEventSchema);
