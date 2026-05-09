import { isBrowser } from './isBrowser';
import type { JsonStorage, StorageLike } from './types';
import { MemoryStorage } from './memory-storage';

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function safeStringify<T>(value: T): string {
  try {
    return JSON.stringify(value);
  } catch {
    return '';
  }
}

function getStorage(): StorageLike {
  return isBrowser() && window.sessionStorage
    ? window.sessionStorage
    : new MemoryStorage();
}

export class SessionStorage implements JsonStorage {
  private storage: StorageLike;

  constructor(storage: StorageLike = getStorage()) {
    this.storage = storage;
  }

  get<T>(key: string, fallback: T | null = null): T | null {
    return safeParse(this.storage.getItem(key), fallback);
  }

  set<T>(key: string, value: T): void {
    this.storage.setItem(key, safeStringify(value));
  }

  remove(key: string): void {
    this.storage.removeItem(key);
  }

  has(key: string): boolean {
    return this.storage.getItem(key) !== null;
  }

  clear(): void {
    this.storage.clear();
  }
}

export const sessionStorage = new SessionStorage();