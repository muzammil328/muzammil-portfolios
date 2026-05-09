import mongoose, { Schema, type Model } from 'mongoose';

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'archived';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface TaskRecord {
  content: string;
  priority: TaskPriority;
  status: TaskStatus;
  recurrence: TaskRecurrence;
  due_date?: string | null;
  sort_order: number;
  user_id?: string;
  created_at: string;
  updated_at: string;
}

const TaskSchema = new Schema<TaskRecord>(
  {
    content: { type: String, required: true, trim: true, maxlength: 500 },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'done', 'archived'],
      default: 'pending',
      required: true,
    },
    recurrence: {
      type: String,
      enum: ['none', 'daily', 'weekly', 'monthly'],
      default: 'none',
      required: true,
    },
    due_date: {
      type: String,
      default: null,
    },
    sort_order: {
      type: Number,
      default: 0,
    },
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
    collection: 'tasks',
  }
);

TaskSchema.index({ status: 1, due_date: 1, created_at: -1 });
TaskSchema.index({ sort_order: -1, created_at: -1 });
TaskSchema.index({ user_id: 1, created_at: -1 });

export const TaskModel: Model<TaskRecord> =
  (mongoose.models.Task as Model<TaskRecord>) || mongoose.model<TaskRecord>('Task', TaskSchema);
