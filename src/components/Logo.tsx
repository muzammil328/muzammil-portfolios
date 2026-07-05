'use client';
import { useTheme } from '@/components/ui';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const LOGO_VARIANTS = {
  // height/width mirror each PNG's real aspect ratio so Next.js reserves the
  // correct box and avoids a layout shift when the image loads
  light: { src: `/logo/muzammil-safdar-light-mode.png`, height: 34, width: 200 },
  dark:  { src: `/logo/muzammil-safdar-dark-mode.png`,  height: 32, width: 170 },
} as const;

export function Logo() {
  const { theme } = useTheme();
  const [prefersDarkScheme, setPrefersDarkScheme] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const update = (e: MediaQueryListEvent | MediaQueryList) => setPrefersDarkScheme(e.matches);
    update(mediaQuery);
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  const currentTheme =
    theme === 'system' ? (prefersDarkScheme ? 'dark' : 'light') : (theme as 'light' | 'dark');

  const { src, height, width } = LOGO_VARIANTS[currentTheme] ?? LOGO_VARIANTS.light;

  return (
    <Link href="/" title="Muzammil Safdar" aria-label="Muzammil Safdar">
      <Image
        src={src}
        alt="Muzammil Safdar"
        className="-ml-3.5"
        height={height}
        width={width}
        priority
      />
    </Link>
  );
}
