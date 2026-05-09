import { z } from 'zod';
import { connectMongo } from '@/lib/mongodb';
import {
  DailyReportHistoryModel,
  type DailyReportHistoryRecord,
  type DailyReportSnapshotItem,
} from '@/models/DailyReportHistory';
import { DailyReportItemModel, type DailyReportItemRecord } from '@/models/DailyReportItem';

const hhmmRegex = /^$|^([01]\d|2[0-3]):([0-5]\d)$/;

const dailyReportItemCreateSchema = z.object({
  text: z.string().trim().min(1, 'Item text is required').max(280),
  time: z.string().trim().regex(hhmmRegex, 'Invalid time').optional().default(''),
  userId: z.string().optional(),
});

const dailyReportItemUpdateSchema = z
  .object({
    text: z.string().trim().min(1).max(280).optional(),
    time: z.string().trim().regex(hhmmRegex, 'Invalid time').optional(),
    checked: z.boolean().optional(),
  })
  .refine(payload => Object.keys(payload).length > 0, {
    message: 'At least one field is required',
  });

const historyItemSchema = z.object({
  text: z.string().trim().min(1).max(280),
  time: z.string().trim().regex(hhmmRegex, 'Invalid time').optional().default(''),
  checked: z.boolean().default(false),
});

const historyUpsertSchema = z.object({
  date: z.string().datetime().optional(),
  itemsSnapshot: z.array(historyItemSchema).min(1, 'At least one report item is required'),
});

function toItemResponse(record: DailyReportItemRecord & { _id?: unknown }) {
  return {
    id:
      typeof record._id === 'object' && record._id && 'toString' in record._id
        ? String(record._id)
        : String(record._id || ''),
    text: record.text,
    time: record.time,
    checked: record.checked,
  };
}

function toHistoryResponse(record: DailyReportHistoryRecord & { _id?: unknown }) {
  return {
    id:
      typeof record._id === 'object' && record._id && 'toString' in record._id
        ? String(record._id)
        : String(record._id || ''),
    date: record.date,
    score: record.score,
    totalItems: record.total_items,
    completedItems: record.completed_items,
    itemsSnapshot: record.items_snapshot.map(item => ({
      text: item.text,
      time: item.time,
      checked: item.checked,
    })),
  };
}

function normalizeDayKey(dateInput?: string) {
  const sourceDate = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(sourceDate.getTime())) {
    throw new Error('Invalid report date');
  }

  const dayKey = sourceDate.toISOString().slice(0, 10);
  const normalizedDate = new Date(`${dayKey}T00:00:00.000Z`).toISOString();

  return { dayKey, normalizedDate };
}

export async function listDailyReportItems(userId?: string, isAdmin?: boolean) {
  await connectMongo();

  const filter = isAdmin ? {} : userId ? { user_id: userId } : {};

  const items = await DailyReportItemModel.find(filter).sort({ time: 1, created_at: 1 }).lean();
  return items.map(item => toItemResponse(item));
}

export async function createDailyReportItem(payload: unknown, userId?: string) {
  const parsed = dailyReportItemCreateSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid report item');
  }

  await connectMongo();

  const now = new Date().toISOString();
  const created = await DailyReportItemModel.create({
    text: parsed.data.text,
    time: parsed.data.time || '',
    checked: false,
    user_id: userId || parsed.data.userId || undefined,
    created_at: now,
    updated_at: now,
  });

  const lean = created.toObject();
  return toItemResponse(lean);
}

export async function updateDailyReportItem(
  itemId: string,
  payload: unknown,
  userId?: string,
  isAdmin?: boolean
) {
  const parsed = dailyReportItemUpdateSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid update payload');
  }

  await connectMongo();

  const filter: Record<string, unknown> = { _id: itemId };
  if (!isAdmin && userId) {
    filter.user_id = userId;
  }

  const update: Partial<DailyReportItemRecord> = { updated_at: new Date().toISOString() };
  if (parsed.data.text !== undefined) update.text = parsed.data.text;
  if (parsed.data.time !== undefined) update.time = parsed.data.time;
  if (parsed.data.checked !== undefined) update.checked = parsed.data.checked;

  const updated = await DailyReportItemModel.findOneAndUpdate(
    filter,
    { $set: update },
    { returnDocument: 'after' }
  )
    .lean()
    .exec();

  if (!updated) {
    throw new Error('Report item not found');
  }

  return toItemResponse(updated);
}

export async function deleteDailyReportItem(itemId: string, userId?: string, isAdmin?: boolean) {
  await connectMongo();

  const filter: Record<string, unknown> = { _id: itemId };
  if (!isAdmin && userId) {
    filter.user_id = userId;
  }

  const deleted = await DailyReportItemModel.findOneAndDelete(filter).lean().exec();

  if (!deleted) {
    throw new Error('Report item not found');
  }

  return { id: itemId };
}

export async function listDailyReportHistory() {
  await connectMongo();

  const history = await DailyReportHistoryModel.find().sort({ date: -1 }).lean();
  return history.map(record => toHistoryResponse(record));
}

export async function upsertDailyReportHistory(payload: unknown) {
  const parsed = historyUpsertSchema.safeParse(payload);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Invalid history payload');
  }

  await connectMongo();

  const { dayKey, normalizedDate } = normalizeDayKey(parsed.data.date);
  const snapshot: DailyReportSnapshotItem[] = parsed.data.itemsSnapshot.map(item => ({
    text: item.text,
    time: item.time || '',
    checked: Boolean(item.checked),
  }));

  const totalItems = snapshot.length;
  const completedItems = snapshot.filter(item => item.checked).length;
  const score = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const now = new Date().toISOString();

  const saved = await DailyReportHistoryModel.findOneAndUpdate(
    { date_key: dayKey },
    {
      $set: {
        date: normalizedDate,
        date_key: dayKey,
        score,
        total_items: totalItems,
        completed_items: completedItems,
        items_snapshot: snapshot,
        updated_at: now,
      },
      $setOnInsert: {
        created_at: now,
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  )
    .lean()
    .exec();

  if (!saved) {
    throw new Error('Failed to save report history');
  }

  return toHistoryResponse(saved);
}
