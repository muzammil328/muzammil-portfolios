'use client';

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/cn';
import {
  ArrowRight,
  Layers,
  Star,
  Zap,
  Layout,
  Code,
  Code2,
  Shield,
  Globe,
  Smartphone,
  Server,
  Database,
  Settings,
  Palette,
  Search,
  Monitor,
  GitBranch,
  Lock,
  Cpu,
  Box,
  Rocket,
  FileText,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  layout: Layout,
  zap: Zap,
  code: Code,
  'code-2': Code2,
  shield: Shield,
  globe: Globe,
  layers: Layers,
  smartphone: Smartphone,
  server: Server,
  database: Database,
  settings: Settings,
  star: Star,
  palette: Palette,
  search: Search,
  monitor: Monitor,
  'git-branch': GitBranch,
  lock: Lock,
  cpu: Cpu,
  box: Box,
  rocket: Rocket,
  'file-text': FileText,
  'check-circle': CheckCircle,
};
import { getServices } from '@/services/portfolioService';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ServiceTypes } from '@/types/Service';

gsap.registerPlugin(ScrollTrigger);

/* Each tech icon orbits one of the two dashed rings. Radii are viewport-scaled
   (vw, clamped) so the orbit shrinks to fit on narrow screens instead of
   overflowing the card. Durations are staggered per item and delays spread
   evenly (in thirds of a circle) so icons on the same ring don't bunch up. */
const ORBIT_RADII = [
  'clamp(100px, 27.5vw, 215px)',
  'clamp(100px, 27.5vw, 215px)',
  'clamp(100px, 27.5vw, 215px)',
  'clamp(65px, 18vw, 140px)',
  'clamp(65px, 18vw, 140px)',
  'clamp(65px, 18vw, 140px)',
];
const ORBIT_DURATIONS = [26, 31, 36, 18, 22, 27];

/* Below this width the card's two-column layout collapses to a single
   column (see the `max-[900px]:grid-cols-1` card class below) — the pinned
   scroll-stack animation is disabled at the same threshold so a card's
   content never has to fit inside a fixed height it no longer matches. */
const MOBILE_BREAKPOINT = 900;

/* ─── Accent palette per card index ─── */
const accentMap = {
  0: {
    dot: 'bg-blue-400',
    focusBg: 'bg-blue-500/5 border-blue-400/20',
    iconBg: 'bg-blue-500/10',
    badge_fg: 'bg-blue-500/15 border-blue-400/50 text-blue-600 dark:text-blue-300',
    badge_bg: 'bg-blue-500/6 border-blue-400/20 text-blue-400/70 dark:text-blue-400/50',
    statCard: 'bg-blue-500/5 border-blue-400/15',
    checkColor: 'text-blue-500',
    ctaHover: 'hover:shadow-blue-500/20',
  },
  1: {
    dot: 'bg-emerald-400',
    focusBg: 'bg-emerald-500/5 border-emerald-400/20',
    iconBg: 'bg-emerald-500/10',
    badge_fg: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-600 dark:text-emerald-300',
    badge_bg: 'bg-emerald-500/6 border-emerald-400/20 text-emerald-400/70 dark:text-emerald-400/50',
    statCard: 'bg-emerald-500/5 border-emerald-400/15',
    checkColor: 'text-emerald-500',
    ctaHover: 'hover:shadow-emerald-500/20',
  },
  2: {
    dot: 'bg-amber-400',
    focusBg: 'bg-amber-500/5 border-amber-400/20',
    iconBg: 'bg-amber-500/10',
    badge_fg: 'bg-amber-500/15 border-amber-400/50 text-amber-600 dark:text-amber-300',
    badge_bg: 'bg-amber-500/6 border-amber-400/20 text-amber-400/70 dark:text-amber-400/50',
    statCard: 'bg-amber-500/5 border-amber-400/15',
    checkColor: 'text-amber-500',
    ctaHover: 'hover:shadow-amber-500/20',
  },
  3: {
    dot: 'bg-purple-400',
    focusBg: 'bg-purple-500/5 border-purple-400/20',
    iconBg: 'bg-purple-500/10',
    badge_fg: 'bg-purple-500/15 border-purple-400/50 text-purple-600 dark:text-purple-300',
    badge_bg: 'bg-purple-500/6 border-purple-400/20 text-purple-400/70 dark:text-purple-400/50',
    statCard: 'bg-purple-500/5 border-purple-400/15',
    checkColor: 'text-purple-500',
    ctaHover: 'hover:shadow-purple-500/20',
  },
} as const;
type AccentKey = keyof typeof accentMap;

export default function WhatIDo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [services, setServices] = useState<ServiceTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useLayoutEffect(() => {
    if (isMobile) return;
    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      if (cards.length === 0) return;
      const totalScroll = window.innerHeight * (services.length + 2.5);
      gsap.set(cards, { y: window.innerHeight, opacity: 0, scale: 0.92 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: true,
          scrub: 1,
        },
      });
      cards.forEach((card, i) => {
        if (i === 0) {
          tl.to(card, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' });
        } else {
          tl.to(card, { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.out' }, '+=0.1').to(
            cards[i - 1],
            { opacity: 0, scale: 0.95, duration: 0.5 },
            '<',
          );
        }
      });
      tl.to({}, { duration: 1 });
    }, sectionRef);
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, [services.length, isMobile]);

  if (loading) {
    return (
      <section className="min-h-screen w-full flex items-center justify-center py-20">
        <div className="container mx-auto px-6 w-full space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-3xl border border-border/60 bg-card/80 backdrop-blur p-8 h-72 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full flex flex-col items-center justify-start bg-background relative md:py-20 sm:py-12 py-8"
      style={{
        backgroundImage: `
      radial-gradient(circle at 12% 14%, rgba(108,92,231,.13), transparent 26rem),
      radial-gradient(circle at 92% 78%, rgba(22,119,255,.10), transparent 28rem)
    `,
      }}
    >
      {/* Heading */}
      <div className="w-full container mx-auto md:px-6 px-3 mb-6 md:mb-12 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:pb-8 pb-4">
          <h2 className="text-5xl md:text-8xl font-medium tracking-tighter">What I Do

            <span
              className="text-transparent"
              style={{ WebkitTextStroke: "2px #6c5ce7" }}
            >
              /
            </span>
          </h2>
          <p className="hidden md:block text-base sm:text-lg md:text-xl text-muted-foreground md:max-w-xl leading-relaxed">
            I specialize in building fast, reliable, and user-friendly full-stack web applications.
            I help small businesses and startups turn ideas into high-quality products that scale.
          </p>
        </div>
      </div>

      {/* Cards */}
      <div
        id="skills"
        ref={containerRef}
        className={cn(
          'w-full px-3 min-[901px]:container min-[901px]:mx-auto min-[901px]:px-6',
          isMobile ? 'flex flex-col gap-6' : 'relative h-screen min-[901px]:h-160',
        )}
      >

        {services.map((service, index) => {
          const accent = accentMap[index as AccentKey] || accentMap[0];
          const focusItems = service.focus;
          const summary = service.summary;
          const featuredSkill = service.skills.find((skill) => skill.featured && skill.icon);
          const orbitingSkills = service.skills
            .filter((skill) => skill !== featuredSkill)
            .slice(0, 6);

          return (
            <div
              key={service._id || index}
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
              className={cn(
                'rounded-3xl border border-border backdrop-blur-xl overflow-hidden',
                'border border-black/8 rounded-4xl bg-white/82 dark:bg-[#141828]/82 backdrop-blur-[18px] shadow-card dark:shadow-card-dark grid grid-cols-1 max-[900px]:min-h-0 min-[901px]:grid-cols-[minmax(320px,.9fr)_1.1fr] min-h-137.5 min-[901px]:min-h-160',
                isMobile ? 'relative w-full' : 'absolute top-0 left-0 w-full h-full',
              )}
              style={isMobile ? undefined : { zIndex: index + 1 }}
            >
              {/* Dot grid */}
              <div className="dot-texture absolute inset-0 pointer-events-none opacity-45"></div>

              <div className="relative z-10 p-11 max-[560px]:p-6 flex flex-col border-r border-[#e7e9ef] dark:border-[#2b3142] bg-linear-to-b from-white/86 to-white/52 dark:from-[#1b1f2d]/90 dark:to-[#161a26]/66  max-[900px]:border-r-0 max-[900px]:border-b">
                {/* Title row */}
                <div className="flex flex-col items-start min-w-0">
                  <h3 className="text-[31px] tracking-[-.045em] max-[560px]:text-2xl truncate">
                    {service.name}
                  </h3>
                  <p className="mt-2.5 mb-7 text-[#686d7b] dark:text-[#a7adbc] leading-[1.6]">
                    {summary}
                  </p>
                </div>

                <div className="text-[14px] font-black tracking-[.16em] text-[#9297a4] uppercase mb-3">Core capabilities</div>

                {/* Core capabilities */}
                <div className="mb-3">

                  <div className="grid grid-cols-1 gap-2">
                    {focusItems.map((item, i) => {
                      const Icon = ICON_MAP[item.icon ?? ''] || Layers;
                      return (
                        <div
                          key={i}
                          className={cn(
                            'grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl border p-2.5 transition-all duration-200 hover:translate-x-1 ',
                            accent.focusBg,
                          )}
                        >
                          <div
                            className={cn(
                              'flex items-center justify-center w-9 h-9 rounded-lg shrink-0',
                              accent.iconBg,
                              accent.checkColor,
                            )}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm pb-1 font-semibold leading-tight truncate">
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-[10px] text-muted-foreground leading-snug truncate">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto pt-3 flex flex-wrap items-center gap-2">
                  <Button asChild>
                    <Link
                      href={`/services/${service.slug}`}
                      aria-label={`View work for ${service.name}`}
                      className="flex items-center gap-1.5 group"
                    >
                      View Work
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link
                      href={`/contact?${new URLSearchParams({ service: service.name, source: 'home' }).toString()}`}
                    >
                      Discuss a project
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="relative z-10 flex flex-col justify-center p-11 pb-8.5 max-[560px]:p-6">
                <div
                  className="relative min-h-[clamp(220px,58vw,420px)] grid place-items-center"
                  aria-label="Technology stack"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(200px,55vw,430px)] h-[clamp(200px,55vw,430px)] border border-dashed border-brand/[.22] rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(130px,36vw,280px)] h-[clamp(130px,36vw,280px)] border border-dashed border-brand/[.22] rounded-full"></div>

                  {featuredSkill && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-1 flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-[#1b2030] border border-[#e7e9ef] dark:border-[#2b3142] shadow-[0_14px_35px_rgba(26,33,57,.10)]">
                      <Image
                        src={featuredSkill.icon as string}
                        alt={featuredSkill.name}
                        width={40}
                        height={40}
                        className="w-9 h-9 object-contain"
                      />
                    </div>
                  )}

                  {orbitingSkills.map((skill, i) => {
                    const ringPosition = i % 3;
                    const duration = ORBIT_DURATIONS[i];
                    const delay = -(ringPosition / 3) * duration;
                    return (
                      <div
                        key={skill.name}
                        className="orbit-item"
                        style={
                          {
                            '--orbit-radius': ORBIT_RADII[i],
                            animationName: i % 2 === 0 ? 'orbit' : 'orbit-reverse',
                            animationDuration: `${duration}s`,
                            animationDelay: `${delay}s`,
                          } as React.CSSProperties
                        }
                      >
                        <div className="-ml-3.75 -mt-3.75 flex items-center justify-center p-2.5 rounded-[14px] bg-white dark:bg-[#1b2030] border border-[#e7e9ef] dark:border-[#2b3142]">
                          {skill.icon ? (
                            <Image
                              src={skill.icon}
                              alt={skill.name}
                              width={30}
                              height={30}
                              className="w-8 h-8 rounded-[9px] object-contain"
                            />
                          ) : (
                            <span
                              className="w-7.5 h-7.5 rounded-[9px] grid place-items-center text-[11px] text-white font-black bg-primary"
                              aria-label={skill.name}
                            >
                              {skill.name.trim().slice(0, 2).toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
