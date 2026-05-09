import type { Metadata } from 'next';
import { Suspense } from 'react';
import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Contact | Muzammil Safdar',
  description: 'Get in touch for project inquiries and collaborations.',
};

function ContactPageSkeleton() {
  return (
    <div className="min-h-screen pt-24 pb-16 container mx-auto px-4">
      <div className="max-w-2xl mx-auto space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-muted rounded" />
        <div className="space-y-4">
          <div className="h-10 w-full bg-muted rounded" />
          <div className="h-10 w-full bg-muted rounded" />
          <div className="h-32 w-full bg-muted rounded" />
        </div>
        <div className="h-12 w-32 bg-muted rounded" />
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPageClient />
    </Suspense>
  );
}
