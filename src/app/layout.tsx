import './global.css';
import { Providers } from '@/components/Provider';
import { GoogleAnalytics } from '@next/third-parties/google';
import ClarityInit from "@/components/ClarityInit";

export const metadata = {
  metadataBase: new URL('https://mmuzammil-portfolio.vercel.app'),
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
    url: 'https://mmuzammil-portfolio.vercel.app',
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
        <GoogleAnalytics gaId="G-EQSBL2DGBM" />
        <ClarityInit />
      </body>
    </html>
  );
}
