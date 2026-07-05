'use client';

import { useTheme as useNextTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { THEME } from './constants';

export function useTheme() {
  const { theme, setTheme: setNextTheme, systemTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === THEME.SYSTEM ? systemTheme : theme;
  const isDark = currentTheme === THEME.DARK;
  const isLight = currentTheme === THEME.LIGHT;
  const isSystem = theme === THEME.SYSTEM;

  const toggleTheme = () => {
    if (currentTheme === THEME.DARK) {
      setNextTheme(THEME.LIGHT);
    } else {
      setNextTheme(THEME.DARK);
    }
  };

  const setTheme = (newTheme: (typeof THEME)[keyof typeof THEME]) => {
    setNextTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    systemTheme,
    resolvedTheme: resolvedTheme || currentTheme,
    currentTheme,
    isDark,
    isLight,
    isSystem,
    toggleTheme,
    mounted,
  };
}
