import mongoose, { Schema, type Model } from 'mongoose';

export interface DailyReportItemRecord {
  text: string;
  time: string;
  checked: boolean;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

const DailyReportItemSchema = new Schema<DailyReportItemRecord>(
  {
    text: { type: String, required: true, trim: true, maxlength: 280 },
    time: { type: String, default: '' },
    checked: { type: Boolean, default: false },
    user_id: {
      type: String,
      default: null,
    },
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
    collection: 'daily_report_items',
  }
);

DailyReportItemSchema.index({ created_at: -1 });
DailyReportItemSchema.index({ time: 1, created_at: 1 });
DailyReportItemSchema.index({ user_id: 1, created_at: -1 });

export const DailyReportItemModel: Model<DailyReportItemRecord> =
  (mongoose.models.DailyReportItem as Model<DailyReportItemRecord>) ||
  mongoose.model<DailyReportItemRecord>('DailyReportItem', DailyReportItemSchema);
