'use client';

import { SunIcon, MoonIcon } from '@muzammil328/icon';
import { useTheme } from '@muzammil328/ui';
import { Button } from '@muzammil328/ui';

export default function DarkLightModeButton() {
  const { mounted, isDark, setTheme } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle dark mode"
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-md backdrop-blur-sm"
      >
        <SunIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="w-12 h-12 rounded-tl-full rounded-bl-full"
    >
      <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
