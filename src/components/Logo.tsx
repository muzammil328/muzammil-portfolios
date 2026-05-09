'use client';
import { useTheme } from '@muzammil328/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LogoConfig {
  src: string;
  height: number;
  width: number;
}

const LOGO_VARIANTS: Record<'light' | 'dark', LogoConfig> = {
  light: {
    src: '/logo/muzammil-safdar-light-mode.png',
    height: 120,
    width: 200,
  },
  dark: {
    src: '/logo/muzammil-safdar-dark-mode.png',
    height: 165,
    width: 170,
  },
};

export function Logo() {
  const { theme } = useTheme();
  const [prefersDarkScheme, setPrefersDarkScheme] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateScheme = (e: MediaQueryListEvent | MediaQueryList) =>
      setPrefersDarkScheme(e.matches);

    updateScheme(mediaQuery);
    mediaQuery.addEventListener('change', updateScheme);
    return () => mediaQuery.removeEventListener('change', updateScheme);
  }, []);

  const currentTheme =
    theme === 'system' ? (prefersDarkScheme ? 'dark' : 'light') : (theme as 'light' | 'dark');

  const logoConfig = LOGO_VARIANTS[currentTheme] ?? LOGO_VARIANTS.light;

  return (
    <Link href="/" title="Muzammil Safdar" aria-label="Muzammil Safdar">
      <Image
        src={logoConfig.src}
        alt="Muzammil Safdar"
        className="-ml-3.5"
        height={logoConfig.height}
        width={logoConfig.width}
        priority
      />
    </Link>
  );
}
