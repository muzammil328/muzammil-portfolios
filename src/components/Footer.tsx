'use client';

import React from 'react';
import Link from 'next/link';
import { GitHubIcon, LinkedInIcon } from '@muzammil328/icon';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Work',      href: '/portfolio' },
  { label: 'Services',  href: '/services' },
  { label: 'About',     href: '/about' },
  { label: 'Contact',   href: '/contact' },
];

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/mmuzammilsafdar/',
    icon: <LinkedInIcon />,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Muzammil327',
    icon: <GitHubIcon />,
  },
];

function FooterContent() {
  return (
    <div className="flex flex-col h-full">

      {/* ── Top CTA ── */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-12">
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-6">
          <span className="w-4 h-px bg-white/30" />
          Available for freelance
          <span className="w-4 h-px bg-white/30" />
        </span>

        <h2 className="text-[clamp(3rem,9vw,8rem)] leading-[0.88] font-bold tracking-tight mb-6">
          Let&apos;s Build
          <br />
          <span className="text-white/20">Something</span>
          <br />
          Great.
        </h2>

        <p className="text-white/50 max-w-sm text-base leading-relaxed mb-10">
          I craft fast, accessible, and beautiful web products.
          If you have a project in mind — let&apos;s talk.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="group flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-white/90 transition-all duration-300 hover:shadow-xl hover:shadow-white/10"
          >
            Start a Project
            <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <Link
            href="mailto:mmuzammilsafdar@gmail.com"
            className="flex items-center gap-2 border border-white/15 text-white/70 px-7 py-3.5 rounded-full font-semibold text-sm hover:border-white/40 hover:text-white transition-all duration-300"
          >
            <Mail className="w-4 h-4" />
            Send an Email
          </Link>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-6 md:mx-12 border-t border-white/8" />

      {/* ── Middle row: nav + socials ── */}
      <div className="px-6 md:px-12 py-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">

        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <span className="text-xl font-bold tracking-tight">Muzammil.</span>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <MapPin className="w-3 h-3" />
            Lahore, Pakistan
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/50 hover:text-white transition-colors duration-200 font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex items-center gap-2">
          {SOCIAL_LINKS.map(s => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className="w-9 h-9 rounded-full border border-white/12 flex items-center justify-center text-white/50 hover:text-white hover:border-white/35 transition-all duration-200"
            >
              {s.icon}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="mx-6 md:mx-12 border-t border-white/8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/30">
        <span>&copy; {new Date().getFullYear()} Muzammil Safdar. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Built with
          <span className="text-white/50 mx-0.5">Next.js</span>
          &amp;
          <span className="text-white/50 mx-0.5">Sanity</span>
        </span>
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <div
      className="relative h-[680px] md:h-[640px]"
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
    >
      <div className="fixed bottom-0 h-[680px] md:h-[640px] w-full">
        <div className="relative h-full w-full bg-[#111111] text-white overflow-hidden flex flex-col">
          {/* Subtle grid texture */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '60px 60px',
            }}
          />
          {/* Radial glow top-centre */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at top, rgba(120,120,255,0.08) 0%, transparent 70%)',
            }}
          />
          <FooterContent />
        </div>
      </div>
    </div>
  );
}
