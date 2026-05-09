import { isBrowser } from './isBrowser';
import type { CookieOptions } from './types';

function resolveExpiry(expires?: number | Date): Date {
  if (!expires) return new Date(Date.now() + 7 * 86400000);

  return typeof expires === 'number'
    ? new Date(Date.now() + expires * 86400000)
    : expires;
}

export function setCookie(
  name: string,
  value: string,
  options: CookieOptions = {}
): void {
  if (!isBrowser()) return;

  const expires = resolveExpiry(options.expires).toUTCString();
  const path = options.path ?? '/';
  const secure = options.secure ?? true;
  const sameSite = options.sameSite ?? 'Lax';

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=${path}; SameSite=${sameSite}`;

  if (options.contracts) cookie += `; contracts=${options.contracts}`;
  if (secure) cookie += '; Secure';

  document.cookie = cookie;
}

export function getCookie(name: string): string | null {
  if (!isBrowser()) return null;

  const key = encodeURIComponent(name) + '=';
  const cookies = document.cookie.split('; ');

  for (const c of cookies) {
    if (c.startsWith(key)) {
      return decodeURIComponent(c.slice(key.length));
    }
  }

  return null;
}

export function removeCookie(name: string, path = '/'): void {
  if (!isBrowser()) return;

  document.cookie = `${encodeURIComponent(
    name
  )}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;
}

export function getAllCookies(): Record<string, string> {
  if (!isBrowser()) return {};

  const result: Record<string, string> = {};
  const cookies = document.cookie.split('; ');

  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split('=');
    result[decodeURIComponent(key)] = decodeURIComponent(rest.join('='));
  }

  return result;
}