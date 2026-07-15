import mongoose, { Schema, type Model } from 'mongoose';

export interface JobApplyCVRecord {
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const JobApplyCVSchema = new Schema<JobApplyCVRecord>(
  {
    name: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
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
    collection: 'job_apply_cvs',
  },
);

JobApplyCVSchema.index({ created_at: -1 });

export const JobApplyCVModel: Model<JobApplyCVRecord> =
  (mongoose.models.JobApplyCV as Model<JobApplyCVRecord>) ||
  mongoose.model<JobApplyCVRecord>('JobApplyCV', JobApplyCVSchema);
