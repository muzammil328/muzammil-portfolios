import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/guards';
import { getUserById } from '@/lib/auth/userService';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const payload = await requireAuth(req);
  if (payload instanceof NextResponse) {
    return payload;
  }

  try {
    const user = await getUserById(payload.user_id);
    return NextResponse.json(
      {
        success: true,
        data: { user },
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch user';

    if (message.includes('not found')) {
      return NextResponse.json({ success: false, message }, { status: 404 });
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
