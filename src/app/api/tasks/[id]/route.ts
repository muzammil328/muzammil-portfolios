import { NextRequest, NextResponse } from 'next/server';
import { requireFeature } from '@/lib/auth/guards';
import { deleteTask, updateTask } from '@/lib/tasks';

export const runtime = 'nodejs';

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: NextRequest, { params }: Params) {
  const payload = await requireFeature(req, 'tasks');
  if (payload instanceof NextResponse) return payload;

  const isAdmin = payload.role === 'admin';
  const userId = isAdmin ? undefined : payload.user_id;

  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateTask(id, body, userId, isAdmin);
    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update task';

    if (/not found|unauthorized/i.test(message)) {
      return NextResponse.json({ success: false, message }, { status: 404 });
    }

    const status = /required|invalid/i.test(message) ? 400 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const payload = await requireFeature(req, 'tasks');
  if (payload instanceof NextResponse) return payload;

  const isAdmin = payload.role === 'admin';
  const userId = isAdmin ? undefined : payload.user_id;

  try {
    const { id } = await params;
    const deleted = await deleteTask(id, userId, isAdmin);
    return NextResponse.json(deleted);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete task';

    if (/not found|unauthorized/i.test(message)) {
      return NextResponse.json({ success: false, message }, { status: 404 });
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
