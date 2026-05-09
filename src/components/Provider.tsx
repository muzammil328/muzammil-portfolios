'use client';
import { Toaster } from '@muzammil328/ui';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from 'next-themes';
import PublicAnalyticsTracker from '@/components/PublicAnalyticsTracker';
import DarkLightModeButton from './DarkLightModeButton';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="fixed top-40 right-0 z-50">
        <DarkLightModeButton />
      </div>
      <SpeedInsights />
      <Analytics />
      <PublicAnalyticsTracker />
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
