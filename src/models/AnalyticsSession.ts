import mongoose, { Schema, type Model } from 'mongoose';

export interface AnalyticsSessionRecord {
  visitor_id: string;
  session_id: string;
  entry_path: string;
  last_path: string;
  started_at: Date;
  last_seen_at: Date;
  total_tracked_ms: number;
  event_count: number;
}

const AnalyticsSessionSchema = new Schema<AnalyticsSessionRecord>(
  {
    visitor_id: { type: String, required: true, index: true },
    session_id: { type: String, required: true, unique: true, index: true },
    entry_path: { type: String, required: true },
    last_path: { type: String, required: true },
    started_at: { type: Date, default: Date.now },
    last_seen_at: { type: Date, default: Date.now, index: true },
    total_tracked_ms: { type: Number, default: 0 },
    event_count: { type: Number, default: 0 },
  },
  {
    versionKey: false,
    collection: 'analytics_sessions',
  }
);

AnalyticsSessionSchema.index({ visitor_id: 1, last_seen_at: -1 });

export const AnalyticsSessionModel: Model<AnalyticsSessionRecord> =
  (mongoose.models.AnalyticsSession as Model<AnalyticsSessionRecord>) ||
  mongoose.model<AnalyticsSessionRecord>('AnalyticsSession', AnalyticsSessionSchema);
