import { NextRequest, NextResponse } from 'next/server';
import { extractTokenFromHeader, verifyToken } from './tokenUtils';
import type { UserFeature } from '@/models/User';
import type { JWTPayload } from './tokenUtils';

export interface AuthContext {
  user: JWTPayload;
}

export async function extractAuth(req: NextRequest): Promise<JWTPayload | null> {
  const authHeader = req.headers.get('Authorization');
  const headerToken = extractTokenFromHeader(authHeader ?? undefined);
  const cookieToken = req.cookies.get('token')?.value || null;
  const token = headerToken || cookieToken;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function requireAuth(req: NextRequest): Promise<JWTPayload | NextResponse> {
  const payload = await extractAuth(req);

  if (!payload) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  return payload;
}

export async function requireAdminRole(req: NextRequest): Promise<JWTPayload | NextResponse> {
  const payload = await extractAuth(req);

  if (!payload) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  if (payload.role !== 'admin') {
    return NextResponse.json(
      { success: false, message: 'Forbidden: admin access required' },
      { status: 403 }
    );
  }

  return payload;
}

export async function requireFeature(
  req: NextRequest,
  feature: UserFeature
): Promise<JWTPayload | NextResponse> {
  const payload = await extractAuth(req);

  if (!payload) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  if (payload.role === 'admin') {
    return payload;
  }

  if (!payload.features.includes(feature)) {
    return NextResponse.json(
      { success: false, message: `Forbidden: feature '${feature}' not available` },
      { status: 403 }
    );
  }

  return payload;
}
