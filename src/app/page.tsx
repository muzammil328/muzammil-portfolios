import ContactSection from '@/features/home/ContactSection';
import Education from '@/features/home/Education';
import FollowMeBox from '@/features/home/FollowMeBox';
import Footer from '@/components/Footer';
import HeroSection from '@/features/home/HeroSection';
import HorizontalProjects from '@/features/home/HorizontalProjects';
import Navbar from '@/components/Navbar';
import ProfessionalJourney from '@/features/home/ProfessionalJourney';
import WhatIDo from '@/features/home/WhatIDo';
import { fetchProfile } from '@/services/profileService';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Muzammil Safdar | Full Stack Developer',
  description:
    'Full Stack Developer. 8+ production apps shipped. SaaS, marketplaces, and real-time web platforms.',
  openGraph: {
    title: 'Muzammil Safdar | Full Stack Developer',
    description: 'Full Stack Developer. 8+ production apps shipped. SaaS, marketplaces, and real-time web platforms.',
    url: 'https://muzammilsafdar.com',
    siteName: 'Muzammil Safdar',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muzammil Safdar | Full Stack Developer',
    description: 'Full Stack Developer. 8+ production apps shipped. SaaS, marketplaces, and real-time web platforms.',
  },
};

export default async function page() {
  const profile = await fetchProfile();

  return (
    <div>
      <div className="dark:bg-none bg-no-repeat bg-cover bg-center py-3 w-full relative">
        <Navbar />
        <HeroSection profile={profile} />
        <FollowMeBox />
      </div>
      <main>
        <div className="grid lg:grid-cols-2 gap-4 items-start">
          <ProfessionalJourney />
          <Education />
        </div>
        <WhatIDo />
        <HorizontalProjects />
        <Suspense>
        <ContactSection />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
