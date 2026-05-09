import mongoose, { Schema, type Model } from 'mongoose';

export interface PageViewRecord {
  path: string;
  view_count: number;
  created_at: string;
  updated_at: string;
}

const PageViewSchema = new Schema<PageViewRecord>(
  {
    path: { type: String, required: true, trim: true, unique: true },
    view_count: { type: Number, required: true, default: 0 },
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
    collection: 'page_views',
  }
);

PageViewSchema.index({ path: 1 }, { unique: true });

export const PageViewModel: Model<PageViewRecord> =
  (mongoose.models.PageView as Model<PageViewRecord>) ||
  mongoose.model<PageViewRecord>('PageView', PageViewSchema);
