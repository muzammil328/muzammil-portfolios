import mongoose, { Schema, type Model } from 'mongoose';

export interface DailyReportSnapshotItem {
  text: string;
  time: string;
  checked: boolean;
}

export interface DailyReportHistoryRecord {
  date: string;
  date_key: string;
  score: number;
  total_items: number;
  completed_items: number;
  items_snapshot: DailyReportSnapshotItem[];
  created_at: string;
  updated_at: string;
}

const DailyReportSnapshotItemSchema = new Schema<DailyReportSnapshotItem>(
  {
    text: { type: String, required: true, trim: true, maxlength: 280 },
    time: { type: String, default: '' },
    checked: { type: Boolean, default: false },
  },
  {
    _id: false,
    id: false,
  }
);

const DailyReportHistorySchema = new Schema<DailyReportHistoryRecord>(
  {
    date: { type: String, required: true },
    date_key: { type: String, required: true },
    score: { type: Number, required: true, min: 0, max: 100 },
    total_items: { type: Number, required: true, min: 0 },
    completed_items: { type: Number, required: true, min: 0 },
    items_snapshot: { type: [DailyReportSnapshotItemSchema], default: [] },
    created_at: {
      type: String,
      default: () => new Date().toISOString(),
    },
    updated_at: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    versionKey: false,
    collection: 'daily_report_history',
  }
);

DailyReportHistorySchema.index({ date_key: 1 }, { unique: true });
DailyReportHistorySchema.index({ date: -1 });

export const DailyReportHistoryModel: Model<DailyReportHistoryRecord> =
  (mongoose.models.DailyReportHistory as Model<DailyReportHistoryRecord>) ||
  mongoose.model<DailyReportHistoryRecord>('DailyReportHistory', DailyReportHistorySchema);
