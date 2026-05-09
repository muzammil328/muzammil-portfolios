export interface StorageLike {
  clear(): unknown;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface JsonStorage {
  get<T>(key: string, fallback?: T | null): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  has(key: string): boolean;
}

export interface CookieOptions {
  path?: string;
  contracts?: string;
  expires?: number | Date;
  sameSite?: 'Strict' | 'Lax' | 'None';
  secure?: boolean;
}

export interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number;
}

export interface CacheOptions {
  ttl?: number;
  enableMemoryCache?: boolean;
}
