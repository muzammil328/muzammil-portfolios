import { addDays, addMonths, addWeeks } from 'date-fns';
import { z } from 'zod';
import { connectMongo } from '@/lib/mongodb';
import {
  TaskModel,
  type TaskRecord,
  type TaskPriority,
  type TaskRecurrence,
  type TaskStatus,
} from '@/models/Task';

const taskPrioritySchema = z.enum(['low', 'medium', 'high']);
const taskStatusSchema = z.enum(['pending', 'in_progress', 'done', 'archived']);
const taskRecurrenceSchema = z.enum(['none', 'daily', 'weekly', 'monthly']);
const optionalIsoDateSchema = z
  .string()
  .datetime()
  .optional()
  .or(z.literal('').transform(() => undefined));

const createTaskSchema = z.object({
  content: z.string().trim().min(1, 'Task content is required').max(500),
  priority: taskPrioritySchema.default('medium'),
  status: taskStatusSchema.default('pending'),
  recurrence: taskRecurrenceSchema.default('none'),
  dueDate: optionalIsoDateSchema,
  createdAt: z.string().datetime().optional(),
  sortOrder: z.number().optional(),
  userId: z.string().optional(),
});

const updateTaskSchema = z
  .object({
    content: z.string().trim().min(1).max(500).optional(),
    priority: taskPrioritySchema.optional(),
    status: taskStatusSchema.optional(),
    recurrence: taskRecurrenceSchema.optional(),
    dueDate: optionalIsoDateSchema,
    sortOrder: z.number().optional(),
  })
  .refine(payload => Object.keys(payload).length > 0, {
    message: 'At least one field is required',
  });

function toTaskResponse(record: TaskRecord & { _id?: unknown }) {
  return {
    id:
      typeof record._id === 'object' && record._id && 'toString' in record._id
        ? String(record._id)
        : String(record._id || ''),
    content: record.content,
    priority: record.priority,
    status: record.status,
    recurrence: record.recurrence,
    dueDate: record.due_date || undefined,
    createdAt: record.created_at,
  };
}

function getNextDueDate(recurrence: TaskRecurrence, baseDate?: string | null) {
  const startingPoint = baseDate ? new Date(baseDate) : new Date();
  if (Number.isNaN(startingPoint.getTime())) {
    return new Date().toISOString();
  }

  switch (recurrence) {
    case 'daily':
      return addDays(startingPoint, 1).toISOString();
    case 'weekly':
      return addWeeks(startingPoint, 1).toISOString();
    case 'monthly':
      return addMonths(startingPoint, 1).toISOString();
    case 'none':
    default:
      return startingPoint.toISOString();
  }
}

function toTaskUpdate(data: {
  content?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  recurrence?: TaskRecurrence;
  dueDate?: string;
  sortOrder?: number;
}) {
  const update: Partial<TaskRecord> = {
    updated_at: new Date().toISOString(),
  };

  if (data.content !== undefined) update.content = data.content;
  if (data.priority !== undefined) update.priority = data.priority;
  if (data.status !== undefined) update.status = data.status;
  if (data.recurrence !== undefined) update.recurrence = data.recurrence;
  if (data.dueDate !== undefined) update.due_date = data.dueDate;
  if (data.sortOrder !== undefined) update.sort_order = data.sortOrder;

  return update;
}

export async function listTasks(userId?: string, isAdmin?: boolean) {
  await connectMongo();
  const filter = isAdmin ? {} : userId ? { user_id: userId } : {};
  const tasks = await TaskModel.find(filter).sort({ sort_order: -1, created_at: -1 }).lean();
  return tasks.map(task => toTaskResponse(task));
}

export async function createTask(payload: unknown, userId?: string) {
  const parsed = createTaskSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid task payload');
  }

  await connectMongo();

  const now = new Date().toISOString();
  const created = await TaskModel.create({
    content: parsed.data.content,
    priority: parsed.data.priority,
    status: parsed.data.status,
    recurrence: parsed.data.recurrence,
    due_date: parsed.data.dueDate || null,
    sort_order: parsed.data.sortOrder || 0,
    user_id: userId || parsed.data.userId || undefined,
    created_at: parsed.data.createdAt || now,
    updated_at: now,
  });

  const lean = created instanceof TaskModel ? created.toObject() : created;
  return toTaskResponse(lean);
}

export async function updateTask(
  taskId: string,
  payload: unknown,
  userId?: string,
  isAdmin?: boolean
) {
  const parsed = updateTaskSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid task update payload');
  }

  await connectMongo();

  const filter: Record<string, unknown> = { _id: taskId };
  if (!isAdmin && userId) {
    filter.user_id = userId;
  }

  const existing = await TaskModel.findOne(filter).lean().exec();
  if (!existing) {
    throw new Error('Task not found');
  }

  const updated = await TaskModel.findByIdAndUpdate(
    taskId,
    { $set: toTaskUpdate(parsed.data) },
    { new: true }
  )
    .lean()
    .exec();

  if (!updated) {
    throw new Error('Task not found');
  }

  let nextTask: ReturnType<typeof toTaskResponse> | null = null;
  const statusChangedToDone = parsed.data.status === 'done' && existing.status !== 'done';

  if (statusChangedToDone && existing.recurrence !== 'none') {
    const nextDueDate = getNextDueDate(existing.recurrence, existing.due_date);
    const now = new Date().toISOString();

    const createdRecurringTask = await TaskModel.create({
      content: existing.content,
      priority: existing.priority,
      status: 'pending',
      recurrence: existing.recurrence,
      due_date: nextDueDate,
      sort_order: existing.sort_order,
      created_at: now,
      updated_at: now,
    });

    nextTask = toTaskResponse(createdRecurringTask.toObject());
  }

  return {
    task: toTaskResponse(updated),
    nextTask,
  };
}

export async function deleteTask(taskId: string, userId?: string, isAdmin?: boolean) {
  await connectMongo();

  const filter: Record<string, unknown> = { _id: taskId };
  if (!isAdmin && userId) {
    filter.user_id = userId;
  }

  const deleted = await TaskModel.findOneAndDelete(filter).lean().exec();

  if (!deleted) {
    throw new Error('Task not found');
  }

  return { id: taskId };
}
