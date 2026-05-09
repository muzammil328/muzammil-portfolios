'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ContactSection from '@/features/home/ContactSection';

export default function ContactPageClient() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <ContactSection defaultLeadSource="contact" titleAs="h1" />
      </main>
      <Footer />
    </>
  );
}
