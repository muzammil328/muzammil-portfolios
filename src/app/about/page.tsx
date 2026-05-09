'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProfessionalJourney from '@/features/home/ProfessionalJourney';
import AboutMe from '@/features/home/AboutMe';
import Education from '@/features/home/Education';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <AboutMe />
        <section className="grid grid-cols-2">
          <ProfessionalJourney />
          <Education />
        </section>
      </main>
      <Footer />
    </>
  );
}
