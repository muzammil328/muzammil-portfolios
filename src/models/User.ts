import mongoose, { Schema, type Model } from 'mongoose';

export type UserRole = 'admin' | 'user';
export type UserFeature = 'tasks' | 'daily_report' | 'resume';

export interface UserRecord {
  _id: any;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  features: UserFeature[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const UserSchema = new Schema<UserRecord>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 255,
    },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user', required: true },
    features: {
      type: [String],
      enum: ['tasks', 'daily_report', 'resume'],
      default: [],
    },
    is_active: { type: Boolean, default: true },
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
    collection: 'users',
  }
);

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, created_at: -1 });
UserSchema.index({ is_active: 1 });

export const UserModel: Model<UserRecord> =
  (mongoose.models.User as Model<UserRecord>) || mongoose.model<UserRecord>('User', UserSchema);
