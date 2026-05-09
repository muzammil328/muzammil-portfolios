'use client';

import React from 'react';
import Link from 'next/link';
import { GitHubIcon, LinkedInIcon } from '@muzammil328/icon';

function FooterContent() {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className="space-y-4 mb-8">
        <p className="text-sm text-muted-foreground uppercase tracking-widest">
          Let&apos;s create something meaningful
        </p>
      </div>

      <h1 className="text-[8vw] leading-[0.9] font-bold tracking-tight">
        Let&apos;s Work <br /> Together
      </h1>

      <p className="text-muted-foreground max-w-md mt-4 mb-10 text-lg">
        I design clean, user-focused digital experiences for web products and brands. Available for
        freelance projects and collaborations.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
        <Link
          href="/contact"
          className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-all duration-300"
        >
          Start a Project
        </Link>
        <Link
          href="https://www.linkedin.com/in/mmuzammilsafdar/"
          target="_blank"
          className="border border-border text-muted-foreground px-6 py-3 rounded-full font-medium hover:text-white hover:border-white/50 transition-all duration-300 flex items-center gap-2"
        >
          <LinkedInIcon />
          LinkedIn
        </Link>
        <Link
          href="https://github.com/Muzammil327"
          target="_blank"
          className="border border-border text-muted-foreground px-6 py-3 rounded-full font-medium hover:text-white hover:border-white/50 transition-all duration-300 flex items-center gap-2"
        >
          <GitHubIcon />
          GitHub
        </Link>
      </div>

      <div className="w-full border-t border-border/30 py-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span>&copy; 2025 Muzammil Safdar. All rights reserved.</span>
        <span className="hidden sm:inline">|</span>
        <Link
          href="mailto:mmuzammilsafdar@gmail.com"
          className="hover:text-white transition-colors"
        >
          mmuzammilsafdar@gmail.com
        </Link>
        <span className="hidden sm:inline">|</span>
        <span>Lahore, Pakistan</span>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <div
      className="relative h-200"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <div className="fixed bottom-0 h-200 w-full">
        <div className="bg-[#1a1a1a] bg-linear-to-b from-[#1f1f1f] to-[#1a1a1a] md:pt-16 pt-48 md:pb-8 h-full w-full flex flex-col justify-between text-white">
          <FooterContent />
        </div>
      </div>
    </div>
  );
}
