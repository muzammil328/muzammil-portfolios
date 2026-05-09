'use client';

import { useEffect } from 'react';
import { sessionStorage } from '@/utils/session-storage';

interface PageViewTrackerProps {
  path: string;
}

export default function PageViewTracker({ path }: PageViewTrackerProps) {
  useEffect(() => {
    const key = `pv:${path}`;
    let cancelled = false;

    async function trackView() {
      const shouldIncrement =
        typeof window !== 'undefined' && !sessionStorage.get<string>(key, null);
      const method = shouldIncrement ? 'POST' : 'GET';
      const url = shouldIncrement
        ? '/api/page-views'
        : `/api/page-views?path=${encodeURIComponent(path)}`;

      if (shouldIncrement) {
        sessionStorage.set(key, '1');
      }

      const response = await fetch(url, {
        method,
        headers: shouldIncrement ? { 'Content-Type': 'application/json' } : undefined,
        body: shouldIncrement ? JSON.stringify({ path }) : undefined,
      });

      if (cancelled) return;

      if (!response.ok) return;
      await response.json();
    }

    trackView().catch(() => {
      // Swallow view counter failures to avoid impacting page UX.
    });

    return () => {
      cancelled = true;
    };
  }, [path]);

  return null;
}
