'use client';

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/cn';
import { ArrowUpRight } from 'lucide-react';
import { getServices } from '@/services/portfolioService';
import Image from 'next/image';
import { getImageSrc } from '@/utils/getImageSrc';
import Link from 'next/link';
import { ServiceTypes } from '@/types/Service';

gsap.registerPlugin(ScrollTrigger);

const colorMap: Record<number, { color: string; border: string }> = {
  0: { color: 'from-blue-500/10 to-blue-600/5', border: 'border-blue-500/20' },
  1: {
    color: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20',
  },
  2: {
    color: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/20',
  },
  3: {
    color: 'from-purple-500/10 to-purple-600/5',
    border: 'border-purple-500/20',
  },
};

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

      const isMobile = window.innerWidth < 768;
      const totalScroll = isMobile 
        ? window.innerHeight * (services.length + 1.5)
        : window.innerHeight * (services.length + 2.5);

      gsap.set(cards, {
        y: isMobile ? window.innerHeight * 0.3 : window.innerHeight,
        opacity: 0,
        scale: 0.9,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: !isMobile,
          scrub: 1,
        },
      });

      cards.forEach((card, i) => {
        if (i === 0) {
          tl.to(card, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
          });
        } else {
          tl.to(
            card,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
            },
            '+=0.1'
          ).to(
            cards[i - 1],
            {
              opacity: 0,
              scale: 0.95,
              duration: 0.5,
            },
            '<'
          );
        }
      });

      tl.to({}, { duration: 1 });
    }, sectionRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      ctx.revert();
    };
  }, [services.length, isMobile]);

  if (loading) {
    return (
      <section className="min-h-screen w-full flex items-center justify-center py-20">
        <div className="container mx-auto px-6 w-full">
          <div className="rounded-3xl border border-border/60 bg-card/80 backdrop-blur p-6 md:p-10 animate-pulse">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/60 pb-8 mb-8">
              <div className="space-y-4 w-full md:max-w-2xl">
                <div className="h-4 w-32 bg-muted rounded-full" />
                <div className="h-16 w-full md:w-2/3 bg-muted rounded-2xl" />
              </div>
              <div className="h-6 w-full md:w-1/3 bg-muted rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="rounded-3xl border border-border/60 bg-background/70 p-6 h-105"
                >
                  <div className="h-6 w-24 bg-muted rounded-full mb-5" />
                  <div className="space-y-3 mb-8">
                    <div className="h-5 w-3/4 bg-muted rounded-full" />
                    <div className="h-5 w-1/2 bg-muted rounded-full" />
                    <div className="h-5 w-2/3 bg-muted rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <div className="h-10 bg-muted rounded-full" />
                    <div className="h-10 bg-muted rounded-full" />
                    <div className="h-10 bg-muted rounded-full" />
                    <div className="h-10 bg-muted rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const displayServices = services.length > 0 ? services : [];

  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full flex flex-col items-center justify-start bg-background relative md:py-20 sm:py-12 py-8"
    >
      <div className="w-full container mx-auto md:px-6 px-3 mb-6 md:mb-12 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:pb-8 pb-4">
          <h2 className="text-5xl md:text-8xl font-bold tracking-tighter">What I Do /</h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground md:max-w-xl w-auto leading-relaxed text-center md:text-left md:block hidden">
            I specialize in building fast, reliable, and user-friendly full-stack web applications.
            I help small businesses and startups turn ideas into high-quality websites and products
            that actually work and scale.
          </p>
        </div>
      </div>

      <div id="skills" ref={containerRef} className={cn('w-full px-3 md:container md:mx-auto md:px-6', isMobile ? 'flex flex-col gap-6' : 'relative h-screen md:h-125')}>
        {displayServices.map((service, index) => {
          const categorySkills = service.skills?.length > 0 ? service.skills : [];

          const colors = colorMap[index] || colorMap[0];

          return (
            <div
              key={service._id || index}
              ref={el => {
                if (el) cardRefs.current[index] = el;
              }}
              className={cn(
                'rounded-3xl border p-2 sm:p-8 md:p-10 flex flex-col justify-between backdrop-blur-xl bg-linear-to-br overflow-hidden',
                isMobile ? 'relative w-full' : 'absolute top-0 left-0 w-full h-full',
                colors.color,
                colors.border,
                'dark:bg-zinc-900/90 bg-white/90'
              )}
              style={isMobile ? undefined : { zIndex: index + 1 }}
            >
              <div
                className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="flex flex-col h-full relative z-10">
                <div className="w-full border-b border-border/50 pb-6 mb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-2 md:gap-4">
                      <span className="hidden sm:block text-xl md:text-2xl font-mono opacity-50">
                        (0{index + 1})
                      </span>
                      <h3 className="text-3xl md:text-5xl font-bold whitespace-nowrap tracking-tight">
                        {service.name}
                      </h3>
                    </div>
                    {service.isFeatured && (
                      <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        Featured
                      </span>
                    )}
                    <Link
                      href={`/services/${service.slug.current}`}
                      className="hidden md:flex w-14 h-14 rounded-full bg-black dark:bg-white text-white dark:text-black items-center justify-center transform transition-transform hover:scale-110 hover:-rotate-45 cursor-pointer"
                    >
                      <ArrowUpRight className="w-7 h-7" />
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-8 h-full">
                  <div className="col-span-1 md:col-span-2 flex flex-col order-first md:order-last">
                    {service.summary && (
                      <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                        {service.summary}
                      </p>
                    )}

                    {(service.timeline || service.pricing?.startingAt) && (
                      <div className="mb-5 space-y-1 text-sm text-muted-foreground">
                        {service.timeline && <p>Timeline: {service.timeline}</p>}
                        {service.pricing?.startingAt && (
                          <p>
                            Starting at {service.pricing.currency || 'USD'}{' '}
                            {service.pricing.startingAt}
                          </p>
                        )}
                      </div>
                    )}

                    <span className="text-sm uppercase tracking-widest opacity-50 mb-2 md:mb-4 font-semibold">
                      Key Focus
                    </span>
                    <ul className="space-y-3">
                      {(service.focus || []).map((item, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-lg font-medium opacity-90"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground/50" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/services/${service.slug.current}`}
                      className="hidden md:flex w-14 h-14 rounded-full bg-foreground text-background flex items-center justify-center transform transition-transform hover:scale-110 hover:-rotate-45 cursor-pointer mt-auto pt-6"
                    >
                      <ArrowUpRight className="w-7 h-7" />
                    </Link>
                  </div>

                  <div className="col-span-1 flex flex-col border-b md:border-b-0 md:border-r border-border/30 pb-2 md:pb-0 md:pr-6 order-last md:order-first">
                    {(service.deliverables || []).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-2">
                          Deliverables
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(service.deliverables || []).slice(0, 4).map((item, i) => (
                            <span
                              key={`deliverable-${i}`}
                              className="px-3 py-1 rounded-full border border-border/60 text-xs text-foreground/90"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 content-start overflow-visible max-h-none md:max-h-55 md:overflow-y-auto scrollbar-thin pr-0 md:pr-2 border-b md:border-b-0 md:border-r border-border/30 pb-3 md:pb-0 md:pr-6 md:mb-0 mb-3">
                      {categorySkills.map((skill, i) => (
                        <div
                          key={i}
                          className="px-4 py-2 rounded-full border border-primary/10 bg-primary/10 dark:bg-primary/30 text-sm font-medium text-foreground hover:bg-primary/10 hover:scale-105 transition-all duration-200 cursor-default"
                        >
                          {skill.icon && (
                            <span>
                              <Image
                                src={getImageSrc(skill)}
                                alt={skill.name}
                                width={20}
                                height={20}
                                className="inline-block mr-2 rounded-sm"
                              />
                            </span>
                          )}
                          <span>{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
