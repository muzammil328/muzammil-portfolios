import './global.css';
import { Providers } from '@/components/Provider';

export const metadata = {
  metadataBase: new URL('https://muzammil-safdar.com'),
  title: {
    default: 'Muzammil Safdar | Full Stack Developer',
    template: '%s | Muzammil Safdar',
  },
  description:
    'Full Stack Developer building scalable MVPs, SaaS products, and real-time web applications.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://muzammil-safdar.com',
    title: 'Muzammil Safdar | Full Stack Developer',
    description:
      'Full Stack Developer building scalable MVPs, SaaS products, and real-time web applications.',
    siteName: 'Muzammil Safdar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muzammil Safdar | Full Stack Developer',
    description:
      'Full Stack Developer building scalable MVPs, SaaS products, and real-time web applications.',
  },
  verification: {
    google: 'XY95-FqUPkQ1rH0UOK046mTLJkhaqmEtIp--2ScaXhc',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
