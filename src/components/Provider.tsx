'use client';
import { Toaster } from '@/components/ui';
import { ThemeProvider } from 'next-themes';
import DarkLightModeButton from './DarkLightModeButton';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="fixed top-40 right-0 z-50">
        <DarkLightModeButton />
      </div>
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
