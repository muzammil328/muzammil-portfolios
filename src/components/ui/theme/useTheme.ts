'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function useTheme() {
  const { theme, setTheme: setNextTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = (resolvedTheme || theme) === 'dark';

  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setNextTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    isDark,
    mounted,
  };
}
