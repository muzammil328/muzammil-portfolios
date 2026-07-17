import './global.css';
import { Providers } from '@/components/Provider';

export const metadata = {
  metadataBase: new URL('https://mmuzammil-portfolio.vercel.app'),
  title: {
    default: 'Muzammil Safdar | Full Stack Developer',
    template: '%s | Muzammil Safdar',
  },
  description:
    'Full Stack Developer. 8+ production apps shipped. SaaS, marketplaces, and real-time web platforms.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://mmuzammil-portfolio.vercel.app',
    title: 'Muzammil Safdar | Full Stack Developer',
    description:
      'Full Stack Developer. 8+ production apps shipped. SaaS, marketplaces, and real-time web platforms.',
    siteName: 'Muzammil Safdar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muzammil Safdar | Full Stack Developer',
    description:
      'Full Stack Developer. 8+ production apps shipped. SaaS, marketplaces, and real-time web platforms.',
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
