import { connectMongo } from '@/lib/mongodb';
import { PageViewModel } from '@/models/PageView';

export async function incrementPageView(path: string) {
  await connectMongo();

  const now = new Date().toISOString();
  const record = await PageViewModel.findOneAndUpdate(
    { path },
    {
      $inc: { view_count: 1 },
      $set: { updated_at: now },
      $setOnInsert: { path, created_at: now },
    },
    { upsert: true, new: true }
  ).lean();

  return record?.view_count ?? null;
}

export async function getPageViewCount(path: string) {
  await connectMongo();

  const record = await PageViewModel.findOne({ path }).lean();
  return record?.view_count ?? 0;
}
