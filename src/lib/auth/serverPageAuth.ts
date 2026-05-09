import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken, type JWTPayload } from '@/lib/auth/tokenUtils';

export async function getSessionUserFromCookie() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function requireSessionUser(): Promise<JWTPayload> {
  const payload = await getSessionUserFromCookie();

  if (!payload) {
    redirect('/auth/login');
  }

  return payload;
}

export async function requireAdminSessionUser(): Promise<JWTPayload> {
  const payload = await requireSessionUser();

  if (payload.role !== 'admin') {
    redirect('/dashboard');
  }

  return payload;
}
