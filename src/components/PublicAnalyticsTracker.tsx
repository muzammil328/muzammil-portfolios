'use client';

import { useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getCookie, setCookie } from '@/utils/cookie-storage';
import { sessionStorage } from '@/utils/session-storage';

type AnalyticsEventType =
  | 'page_view'
  | 'route_change'
  | 'time_spent'
  | 'scroll_depth'
  | 'cta_click'
  | 'outbound_click'
  | 'form_start'
  | 'form_submit';

type AnalyticsEventPayload = {
  visitorId: string;
  sessionId: string;
  path: string;
  eventType: AnalyticsEventType;
  eventLabel?: string;
  durationMs?: number;
  scrollPercent?: number;
  referrer?: string;
  metadata?: Record<string, unknown>;
};

const VISITOR_KEY = 'ms_visitor_id';
const SESSION_KEY = 'ms_session_id';

function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getOrCreateVisitorId() {
  const cookieValue = getCookie(VISITOR_KEY);
  if (cookieValue) return cookieValue;

  const generated = makeId('v');
  const expiresDate = new Date();
  expiresDate.setTime(expiresDate.getTime() + 365 * 24 * 60 * 60 * 1000);
  setCookie(VISITOR_KEY, generated, { path: '/', expires: expiresDate });
  return generated;
}

function getOrCreateSessionId() {
  const existing = sessionStorage.get<string>(SESSION_KEY, null);
  if (existing) return existing;

  const generated = makeId('s');
  sessionStorage.set(SESSION_KEY, generated);
  return generated;
}

function postEvents(events: AnalyticsEventPayload[]) {
  if (events.length === 0) return;

  void fetch('/api/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ events }),
    keepalive: true,
  }).catch(() => {
    // Ignore analytics failures to keep UX unaffected.
  });
}

export default function PublicAnalyticsTracker() {
  const pathname = usePathname();

  const isPublicPath = useMemo(() => {
    if (!pathname) return false;
    return !pathname.startsWith('/admin');
  }, [pathname]);

  const visitorIdRef = useRef<string>('');
  const sessionIdRef = useRef<string>('');
  const currentPathRef = useRef<string>('');
  const enteredAtRef = useRef<number>(0);
  const maxScrollRef = useRef<number>(0);
  const reportedScrollMarksRef = useRef<Set<number>>(new Set());
  const startedFormsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    visitorIdRef.current = getOrCreateVisitorId();
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  useEffect(() => {
    if (!isPublicPath || !pathname) return;

    const now = Date.now();
    const prevPath = currentPathRef.current;
    const prevEnteredAt = enteredAtRef.current;

    if (prevPath && prevEnteredAt > 0 && prevPath !== pathname) {
      postEvents([
        {
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          path: prevPath,
          eventType: 'time_spent',
          durationMs: now - prevEnteredAt,
          metadata: { reason: 'route_change' },
        },
        {
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          path: pathname,
          eventType: 'route_change',
          referrer: prevPath,
        },
      ]);
    }

    currentPathRef.current = pathname;
    enteredAtRef.current = now;
    maxScrollRef.current = 0;
    reportedScrollMarksRef.current.clear();

    postEvents([
      {
        visitorId: visitorIdRef.current,
        sessionId: sessionIdRef.current,
        path: pathname,
        eventType: 'page_view',
        referrer: document.referrer || undefined,
      },
    ]);

    return () => {
      if (!currentPathRef.current || enteredAtRef.current === 0) return;

      const durationMs = Date.now() - enteredAtRef.current;
      postEvents([
        {
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          path: currentPathRef.current,
          eventType: 'time_spent',
          durationMs,
          metadata: { reason: 'unmount' },
        },
      ]);
    };
  }, [pathname, isPublicPath]);

  useEffect(() => {
    if (!isPublicPath || !pathname) return;

    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const percent = Math.min(100, Math.round((scrollTop / scrollable) * 100));

      if (percent <= maxScrollRef.current) return;
      maxScrollRef.current = percent;

      const marks = [25, 50, 75, 90];
      const crossed = marks.filter(
        mark => percent >= mark && !reportedScrollMarksRef.current.has(mark)
      );
      if (crossed.length === 0) return;

      crossed.forEach(mark => reportedScrollMarksRef.current.add(mark));

      postEvents(
        crossed.map(mark => ({
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          path: pathname,
          eventType: 'scroll_depth',
          scrollPercent: mark,
          eventLabel: `${mark}%`,
        }))
      );
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (anchor?.href) {
        try {
          const url = new URL(anchor.href, window.location.origin);
          if (url.origin !== window.location.origin) {
            postEvents([
              {
                visitorId: visitorIdRef.current,
                sessionId: sessionIdRef.current,
                path: pathname,
                eventType: 'outbound_click',
                eventLabel: url.hostname,
                metadata: {
                  href: url.toString(),
                  text: (anchor.textContent || '').trim().slice(0, 120),
                },
              },
            ]);
          }
        } catch {
          // Ignore invalid URLs.
        }
      }

      const cta = target.closest('[data-cta], button, a') as HTMLElement | null;
      if (!cta) return;

      const ctaLabel =
        cta.getAttribute('data-cta') || (cta.textContent || '').trim().slice(0, 120) || 'cta';

      if (ctaLabel) {
        postEvents([
          {
            visitorId: visitorIdRef.current,
            sessionId: sessionIdRef.current,
            path: pathname,
            eventType: 'cta_click',
            eventLabel: ctaLabel,
          },
        ]);
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null;
      const form = target?.closest('form');
      if (!form) return;

      const key = `${pathname}:${form.getAttribute('id') || form.getAttribute('name') || 'form'}`;
      if (startedFormsRef.current.has(key)) return;
      startedFormsRef.current.add(key);

      postEvents([
        {
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          path: pathname,
          eventType: 'form_start',
          eventLabel: form.getAttribute('id') || form.getAttribute('name') || 'form',
        },
      ]);
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;

      postEvents([
        {
          visitorId: visitorIdRef.current,
          sessionId: sessionIdRef.current,
          path: pathname,
          eventType: 'form_submit',
          eventLabel: form.getAttribute('id') || form.getAttribute('name') || 'form',
        },
      ]);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('click', handleClick);
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('submit', handleSubmit);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('submit', handleSubmit);
    };
  }, [pathname, isPublicPath]);

  return null;
}
