import type { UserRecord, UserRole, UserFeature } from '@/models/User';

export interface JWTPayload {
  user_id: string;
  email: string;
  role: UserRole;
  features: UserFeature[];
  iat: number;
  exp: number;
}

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-change-in-production';
const TOKEN_EXPIRY_HOURS = 24;

function base64UrlEncode(data: string): string {
  const buffer = Buffer.from(data, 'utf-8');
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64UrlDecode(data: string): string {
  let padding = '';
  const mod = data.length % 4;
  if (mod > 0) {
    padding = '='.repeat(4 - mod);
  }
  return Buffer.from(data + padding, 'base64').toString('utf-8');
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Buffer.from(signature)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function hmacVerify(message: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );

  const sigBuffer = Buffer.from(signature.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  return crypto.subtle.verify('HMAC', key, sigBuffer, encoder.encode(message));
}

export async function generateToken(user: UserRecord): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const exp = now + TOKEN_EXPIRY_HOURS * 3600;

  const payload: JWTPayload = {
    user_id: user._id?.toString() || '',
    email: user.email,
    role: user.role,
    features: user.features,
    iat: now,
    exp,
  };

  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64UrlEncode(JSON.stringify(payload));
  const message = `${header}.${body}`;

  const signature = await hmacSign(message, JWT_SECRET);
  return `${message}.${signature}`;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }

  const [header, body, signature] = parts;
  const message = `${header}.${body}`;

  try {
    const isValid = await hmacVerify(message, signature, JWT_SECRET);
    if (!isValid) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(body)) as JWTPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}
