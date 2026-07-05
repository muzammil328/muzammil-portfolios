'use client';

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/cn';
import {
  ArrowRight,
  Layers,
  Clock,
  Users,
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
import { getImageSrc } from '@/utils/getImageSrc';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { ServiceTypes } from '@/types/Service';

gsap.registerPlugin(ScrollTrigger);

/* ─── Accent palette per card index ─── */
const accentMap = {
  0: {
    dot: 'bg-blue-400',
    focusBg: 'bg-blue-500/5 border-blue-400/20',
    badge_fg: 'bg-blue-500/15 border-blue-400/50 text-blue-600 dark:text-blue-300',
    badge_bg: 'bg-blue-500/6 border-blue-400/20 text-blue-400/70 dark:text-blue-400/50',
    statCard: 'bg-blue-500/5 border-blue-400/15',
    checkColor: 'text-blue-500',
    ctaHover: 'hover:shadow-blue-500/20',
  },
  1: {
    dot: 'bg-emerald-400',
    focusBg: 'bg-emerald-500/5 border-emerald-400/20',
    badge_fg: 'bg-emerald-500/15 border-emerald-400/50 text-emerald-600 dark:text-emerald-300',
    badge_bg: 'bg-emerald-500/6 border-emerald-400/20 text-emerald-400/70 dark:text-emerald-400/50',
    statCard: 'bg-emerald-500/5 border-emerald-400/15',
    checkColor: 'text-emerald-500',
    ctaHover: 'hover:shadow-emerald-500/20',
  },
  2: {
    dot: 'bg-amber-400',
    focusBg: 'bg-amber-500/5 border-amber-400/20',
    badge_fg: 'bg-amber-500/15 border-amber-400/50 text-amber-600 dark:text-amber-300',
    badge_bg: 'bg-amber-500/6 border-amber-400/20 text-amber-400/70 dark:text-amber-400/50',
    statCard: 'bg-amber-500/5 border-amber-400/15',
    checkColor: 'text-amber-500',
    ctaHover: 'hover:shadow-amber-500/20',
  },
  3: {
    dot: 'bg-purple-400',
    focusBg: 'bg-purple-500/5 border-purple-400/20',
    badge_fg: 'bg-purple-500/15 border-purple-400/50 text-purple-600 dark:text-purple-300',
    badge_bg: 'bg-purple-500/6 border-purple-400/20 text-purple-400/70 dark:text-purple-400/50',
    statCard: 'bg-purple-500/5 border-purple-400/15',
    checkColor: 'text-purple-500',
    ctaHover: 'hover:shadow-purple-500/20',
  },
} as const;
type AccentKey = keyof typeof accentMap;

/* ─── Stat icons ─── */
const STAT_ICONS = [Layers, Clock, Star, Users, Zap];

/* ─── Proficiency config ─── */
const PROFICIENCY_ORDER = ['expert', 'advanced', 'intermediate', 'beginner', undefined];

const PROFICIENCY_SIZE: Record<string, number> = {
  expert: 72,
  advanced: 60,
  intermediate: 50,
  beginner: 42,
};

/* Large pool of positions so every unique skill gets its own spot */
const ALL_POSITIONS: [number, number, string][] = [
  // [left%, top%, animDelay] — evenly spread across the panel so icons
  // never bunch into one corner regardless of how many are shown
  [8, 12, '0s'],
  [52, 8, '0.6s'],
  [30, 30, '1.2s'],
  [76, 28, '0.3s'],
  [10, 48, '1.7s'],
  [58, 46, '0.9s'],
  [34, 64, '0.2s'],
  [80, 62, '1.5s'],
  [14, 80, '1.1s'],
  [56, 82, '0.4s'],
  [78, 88, '1.9s'],
  [4, 30, '0.8s'],
  [42, 14, '1.4s'],
  [66, 70, '0.5s'],
  [24, 88, '1.6s'],
  [88, 44, '1.0s'],
  [46, 34, '0.1s'],
  [18, 62, '1.3s'],
  [70, 12, '0.7s'],
  [38, 46, '1.8s'],
];

function hexToRgb(hex: string) {
  const h = hex.replace('#', '');
  const n = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16,
  );
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function FloatingBadges({
  skills,
  accentIndex,
}: {
  skills: ServiceTypes['skills'];
  accentIndex: number;
}) {
  if (skills.length === 0) return null;

  /* Deduplicate by name, then sort: expert → advanced → intermediate → beginner → undefined */
  const seen = new Set<string>();
  const unique = skills.filter((s) => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  });
  const sorted = [...unique].sort(
    (a, b) => PROFICIENCY_ORDER.indexOf(a.proficiency) - PROFICIENCY_ORDER.indexOf(b.proficiency),
  );

  /* Split: top half by proficiency = FG (sharp), rest = BG (blurred) */
  const fgCount = Math.ceil(sorted.length / 2);
  const fgSkills = sorted.slice(0, fgCount);
  const bgSkills = sorted.slice(fgCount);

  const iconCircle = (skill: ServiceTypes['skills'][0], layer: 'fg' | 'bg') => {
    const size = PROFICIENCY_SIZE[skill.proficiency ?? ''] ?? (layer === 'fg' ? 52 : 62);
    const rgb = skill.color ? hexToRgb(skill.color) : null;
    const bgStyle = rgb
      ? {
          backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${layer === 'fg' ? 0.13 : 0.06})`,
          borderColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${layer === 'fg' ? 0.38 : 0.15})`,
        }
      : {};
    const imgSize = Math.round(size * 0.52);
    return (
      <div
        className={cn(
          'rounded-2xl border flex items-center justify-center backdrop-blur-sm',
          layer === 'fg'
            ? 'border-border/30 bg-background/70 dark:bg-zinc-800/70'
            : 'border-border/15 bg-background/40 dark:bg-zinc-800/40',
        )}
        style={{ width: size, height: size, ...bgStyle }}
      >
        {skill.icon ? (
          <Image
            src={getImageSrc(skill)}
            alt={skill.name}
            width={imgSize}
            height={imgSize}
            className={cn('object-contain rounded-sm', layer === 'bg' && 'opacity-55')}
            style={{ width: 'auto', height: '100%' }}
          />
        ) : (
          <span
            className="font-bold text-[10px] uppercase tracking-wide opacity-60"
            style={{ color: skill.color ?? undefined }}
          >
            {skill.name.slice(0, 2)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(100,100,220,0.05) 0%, transparent 70%)',
        }}
      />

      {/* BG layer */}
      {bgSkills.map((skill, i) => {
        const [left, top, delay] = ALL_POSITIONS[(fgSkills.length + i) % ALL_POSITIONS.length];
        return (
          <div
            key={`bg-${skill.name}`}
            className="absolute animate-float-bg"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              filter: 'blur(1px)',
              animationDelay: delay,
              animationDuration: `${4.5 + (i % 4) * 0.8}s`,
            }}
          >
            {iconCircle(skill, 'bg')}
          </div>
        );
      })}

      {/* FG layer */}
      {fgSkills.map((skill, i) => {
        const [left, top, delay] = ALL_POSITIONS[i % ALL_POSITIONS.length];
        return (
          <div
            key={`fg-${skill.name}`}
            className="absolute animate-float-fg"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: delay,
              animationDuration: `${3.0 + (i % 5) * 0.6}s`,
            }}
          >
            {iconCircle(skill, 'fg')}
          </div>
        );
      })}
    </div>
  );
}

type FocusItem = { title: string; description?: string; icon?: string };

/* ─── Fallback data ─── */
const FALLBACK_FOCUS: Record<number, FocusItem[]> = {
  0: [
    {
      title: 'Pixel Perfect Design',
      description: 'Every detail crafted with precision',
      icon: 'layout',
    },
    {
      title: 'Performance Optimization',
      description: 'Lightning-fast loading and interactions',
      icon: 'zap',
    },
    {
      title: 'Component Architecture',
      description: 'Scalable, maintainable code structure',
      icon: 'code-2',
    },
    {
      title: 'Responsive & Accessible',
      description: 'Works beautifully on every device',
      icon: 'smartphone',
    },
  ],
  1: [
    {
      title: 'API Design',
      description: 'Clean, documented REST & GraphQL endpoints',
      icon: 'server',
    },
    {
      title: 'Auth & Security',
      description: 'JWT, OAuth2 & role-based access control',
      icon: 'shield',
    },
    {
      title: 'Database Modeling',
      description: 'Efficient schemas for fast queries',
      icon: 'database',
    },
    {
      title: 'Scalable Architecture',
      description: 'Built to handle growth from day one',
      icon: 'layers',
    },
  ],
  2: [
    {
      title: 'Schema Design',
      description: 'Normalised, optimised data structures',
      icon: 'database',
    },
    { title: 'Query Optimization', description: 'Indexes, caching & execution plans', icon: 'zap' },
    { title: 'Modern ORMs', description: 'Prisma, Drizzle & raw SQL expertise', icon: 'code' },
    {
      title: 'Data Migrations',
      description: 'Safe, reversible migration strategies',
      icon: 'git-branch',
    },
  ],
  3: [
    {
      title: 'CI/CD Pipelines',
      description: 'Automated build, test & deploy workflows',
      icon: 'rocket',
    },
    { title: 'Containerisation', description: 'Docker & Compose for consistent envs', icon: 'box' },
    {
      title: 'Cloud Deployment',
      description: 'AWS, Vercel & cloud-native solutions',
      icon: 'globe',
    },
    { title: 'Monitoring & Alerts', description: 'Observability from day one', icon: 'monitor' },
  ],
};

const FALLBACK_DELIVERABLES: Record<number, FocusItem[]> = {
  0: [
    { title: 'Responsive UI', description: 'Works on all screen sizes', icon: 'smartphone' },
    { title: 'Component Library', description: 'Reusable, documented components', icon: 'layers' },
    { title: 'Performance Audit', description: 'Lighthouse score 90+', icon: 'zap' },
    { title: 'SEO Setup', description: 'Meta, sitemap & structured data', icon: 'search' },
  ],
  1: [
    { title: 'REST / GraphQL API', description: 'Fully documented endpoints', icon: 'server' },
    { title: 'Auth System', description: 'JWT & OAuth2 integration', icon: 'lock' },
    { title: 'Database Schema', description: 'Optimised relational design', icon: 'database' },
    { title: 'Unit & E2E Tests', description: 'Confidence in every release', icon: 'check-circle' },
  ],
  2: [
    { title: 'Schema Design', description: 'Clean, normalised structure', icon: 'database' },
    {
      title: 'Migration Scripts',
      description: 'Safe rollback-ready migrations',
      icon: 'git-branch',
    },
    { title: 'ORM Setup', description: 'Prisma or Drizzle configured', icon: 'code' },
    { title: 'Backup Strategy', description: 'Automated & tested backups', icon: 'shield' },
  ],
  3: [
    { title: 'CI/CD Pipeline', description: 'GitHub Actions or GitLab CI', icon: 'rocket' },
    { title: 'Docker & Compose', description: 'Containerised dev & prod envs', icon: 'box' },
    { title: 'Cloud Deployment', description: 'AWS, GCP or Vercel', icon: 'globe' },
    { title: 'SSL & DNS', description: 'Secure, custom domain setup', icon: 'lock' },
  ],
};

const FALLBACK_STATS: { value: string; label: string; iconIdx: number }[] = [
  { value: '50+', label: 'Projects', iconIdx: 0 },
  { value: '4+', label: 'Yrs Exp', iconIdx: 1 },
  { value: '98%', label: 'Satisfaction', iconIdx: 2 },
  { value: '20+', label: 'Clients', iconIdx: 3 },
];

export default function WhatIDo() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [services, setServices] = useState<ServiceTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
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
    >
      {/* Heading */}
      <div className="w-full container mx-auto md:px-6 px-3 mb-6 md:mb-12 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:pb-8 pb-4">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter">What I Do /</h2>
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
          'w-full px-3 md:container md:mx-auto md:px-6',
          isMobile ? 'flex flex-col gap-6' : 'relative h-screen md:h-125',
        )}
      >
        {services.map((service, index) => {
          const accent = accentMap[index as AccentKey] || accentMap[0];
          const skills = service.skills?.length > 0 ? service.skills : [];
          /* normalise: Sanity may still return old plain strings */
          const normaliseFocus = (arr: unknown[]): FocusItem[] =>
            arr.map((v) => (typeof v === 'string' ? { title: v } : (v as FocusItem)));
          const focusItems: FocusItem[] =
            (service.focus || []).length > 0
              ? normaliseFocus(service.focus as unknown[])
              : FALLBACK_FOCUS[index] || FALLBACK_FOCUS[0];
          const deliverables: FocusItem[] =
            (service.deliverables || []).length > 0
              ? normaliseFocus(service.deliverables as unknown[])
              : FALLBACK_DELIVERABLES[index] || FALLBACK_DELIVERABLES[0];
          const stats =
            (service.proofPoints || []).filter((p) => p.value && p.label).length >= 2
              ? (service.proofPoints as { value: string; label: string; iconIdx: number }[])
              : FALLBACK_STATS;

          return (
            <div
              key={service._id || index}
              ref={(el) => {
                if (el) cardRefs.current[index] = el;
              }}
              className={cn(
                'rounded-3xl border border-border backdrop-blur-xl overflow-hidden',
                'dark:bg-zinc-900/92 bg-white/96 shadow-xl shadow-black/5',
                isMobile ? 'relative w-full' : 'absolute top-0 left-0 w-full h-full',
              )}
              style={isMobile ? undefined : { zIndex: index + 1 }}
            >
              {/* Dot grid */}
              <div
                className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                  backgroundSize: '28px 28px',
                }}
              />

              {/* 60 / 40 split */}
              <div className="relative z-10 flex flex-col md:flex-row h-full">
                {/* ── LEFT 60% ── */}
                <div className="flex flex-col flex-1 min-w-0 p-5 md:p-7 md:pr-6 md:basis-[20%]">
                  {/* Title row */}
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate">
                        {service.name}
                      </h3>
                      {service.isFeatured && (
                        <span className="shrink-0 hidden sm:inline-flex rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          Featured
                        </span>
                      )}
                    </div>
                    <Button
                      asChild
                    >
                      <Link
                        href={`/services/${service.slug.current}`}
                        aria-label={`View work for ${service.name}`}
                        className="flex items-center gap-1.5 group"
                      >
                        <span className="hidden sm:inline">View Work</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </Link>
                    </Button>
                  </div>

                  {/* Description */}
                  {service.summary && (
                    <p className="text-xs md:text-sm text-muted-foreground leading-relaxed line-clamp-1 mb-3">
                      {service.summary}
                    </p>
                  )}

                  {/* Key Focus mini-cards */}
                  <div className="mb-3">
                    <span className="text-[12px] uppercase tracking-widest font-bold opacity-40 my-2 block">
                      Key Focus
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {focusItems.slice(0, 4).map((item, i) => {
                        const Icon = ICON_MAP[item.icon ?? ''] || Layers;
                        return (
                          <div
                            key={i}
                            className={cn(
                              'rounded-xl border p-2.5 flex flex-col gap-1.5 transition-all duration-200 hover:scale-[1.02]',
                              accent.focusBg,
                            )}
                          >
                            <Icon className={cn('w-3.5 h-3.5', accent.checkColor)} />
                            <span className="text-xs font-semibold leading-tight">
                              {item.title}
                            </span>
                            {item.description && (
                              <span className="text-[10px] text-muted-foreground leading-snug opacity-80 line-clamp-1">
                                {item.description}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ── RIGHT 40%: floating badge cloud ── */}
                <div className="hidden md:block shrink-0 md:basis-[60%] border-l border-border/15 relative overflow-visible bg-linear-to-br from-muted/10 via-transparent to-transparent self-stretch">
                  {/* Slight overflow to overlap center divider */}
                  <div className="absolute inset-0 -left-6">
                    <FloatingBadges skills={skills} accentIndex={index} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes floatFg {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.9;
          }
          38% {
            transform: translateY(-10px) scale(1.05);
            opacity: 1;
          }
          68% {
            transform: translateY(-5px) scale(0.97);
            opacity: 0.92;
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.9;
          }
        }
        @keyframes floatBg {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.45;
          }
          42% {
            transform: translateY(-14px) scale(1.03);
            opacity: 0.6;
          }
          72% {
            transform: translateY(-6px) scale(0.98);
            opacity: 0.5;
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.45;
          }
        }
        .animate-float-fg {
          animation-name: floatFg;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
        }
        .animate-float-bg {
          animation-name: floatBg;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
        }
      `}</style>
    </section>
  );
}
