import { NextRequest, NextResponse } from 'next/server';

export function requireAdminToken(req: NextRequest) {
  const expectedToken = process.env.ADMIN_DASHBOARD_TOKEN;
  const incomingToken = req.nextUrl.searchParams.get('token') || '';

  if (!expectedToken || incomingToken !== expectedToken) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
