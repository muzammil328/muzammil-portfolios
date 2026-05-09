import { NextRequest, NextResponse } from 'next/server';
import { requireFeature } from '@/lib/auth/guards';
import { createTask, listTasks } from '@/lib/tasks';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const payload = await requireFeature(req, 'tasks');
  if (payload instanceof NextResponse) return payload;

  const isAdmin = payload.role === 'admin';
  const userId = isAdmin ? undefined : payload.user_id;

  try {
    const tasks = await listTasks(userId, isAdmin);
    return NextResponse.json(tasks);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch tasks';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const payload = await requireFeature(req, 'tasks');
  if (payload instanceof NextResponse) return payload;

  const isAdmin = payload.role === 'admin';
  const userId = isAdmin ? undefined : payload.user_id;

  try {
    const body = await req.json();
    const created = await createTask(body, userId);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    const status = /required|invalid/i.test(message) ? 400 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
