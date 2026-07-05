'use client';
import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import PortfolioCard from '@/components/PortfolioCard';
import { PortfolioCardSkeleton } from '@/components/skeletons';
import { getProjects } from '@/services/portfolioService';
import { ProjectCard } from '@/types/Project';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HorizontalProjects() {
  const componentRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<ProjectCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const sanityProjects = await getProjects();
        if (sanityProjects && sanityProjects.length > 0) {
          setProjects(sanityProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  useLayoutEffect(() => {
    // Don't run animation until projects are loaded
    if (projects.length === 0) return;

    const ctx = gsap.context(() => {
      const slider = sliderRef.current;
      if (!slider) return;

      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        gsap.set(slider, { x: 0 });

        const getDistance = () => Math.max(slider.scrollWidth - window.innerWidth, 0);

        gsap.to(slider, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: componentRef.current,
            start: 'top top',
            end: () => `+=${Math.max(getDistance(), 1)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            snap:
              projects.length > 1
                ? {
                    snapTo: 1 / (projects.length - 1),
                    duration: { min: 0.1, max: 0.25 },
                    delay: 0,
                    ease: 'power1.inOut',
                  }
                : undefined,
          },
        });

        ScrollTrigger.refresh();
      });

      mm.add('(max-width: 767px)', () => {
        gsap.set(slider, { clearProps: 'transform' });
      });
    }, componentRef);

    return () => ctx.revert();
  }, [projects.length]);

  const displayProjects = loading ? Array(3).fill(null) : projects;

  return (
    <div
      id="portfolio"
      ref={componentRef}
      className="relative w-full bg-background overflow-hidden flex flex-col h-auto md:h-screen md:justify-center"
    >
      <div className="container mx-auto px-4 md:px-10 mb-8 md:mb-12 md:absolute md:top-10 md:left-0 z-10">
        <h3 className="text-4xl md:text-5xl font-bold mb-6">Recent Projects</h3>
        <p className="text-muted-foreground text-lg">
          Explore a collection of my latest work, ranging from complex web applications to creative
          websites.
        </p>
      </div>

      <div className="w-full h-auto md:h-full flex items-center overflow-visible md:overflow-hidden md:mt-20 mt-2">
        <div
          ref={sliderRef}
          className="flex flex-col md:flex-row h-auto md:h-[65vh] w-full md:w-max md:px-4 px-0 border-y border-zinc-200 dark:border-zinc-900"
        >
          {displayProjects.map((project, index) => (
            <div
              key={index}
              className={`h-auto md:h-full md:p-4 p-2 flex items-center justify-center w-full md:w-[30vw] border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-900 last:border-b-0 md:last:border-r-0 md:shrink-0 ${index >= 6 ? 'hidden md:flex' : 'flex'}`}
            >
              {loading ? (
                <PortfolioCardSkeleton index={index} />
              ) : (
                <PortfolioCard data={project} index={index} />
              )}
            </div>
          ))}
        </div>
      </div>

      {!loading && projects.length > 6 && (
        <div className="md:hidden w-full px-4 pb-6 mt-4">
          <Link
            href="/portfolio"
            className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            See All Projects
          </Link>
        </div>
      )}
    </div>
  );
}
