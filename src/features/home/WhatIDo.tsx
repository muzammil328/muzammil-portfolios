'use client';

import React, { useState, useEffect } from 'react';
import skillsData from '@/data/skills.json';
import Image from 'next/image';

interface Skill {
  name: string;
  icon: string | null;
}

/* Each tech icon travels the perimeter of one of the two dashed rectangles.
   Half-width/half-height are viewport-scaled (vw, clamped) so the path
   shrinks to fit on narrow screens instead of overflowing the card. Items
   alternate between the outer and inner rectangle; within a rectangle,
   durations/delays are derived from the item's position among its
   rectangle-mates (not a fixed-length table) so any number of skills
   spreads evenly around the perimeter instead of stacking on earlier items. */
const ORBIT_RECT_SIZES = [
  { w: 'clamp(140px, 34vw, 480px)', h: 'clamp(80px, 18vw, 190px)' },
  { w: 'clamp(90px, 22vw, 300px)', h: 'clamp(50px, 12vw, 120px)' },
];
/* On mobile the path is portrait (tall) rather than landscape (wide) and
   spans nearly the full card width — the card is narrow but has plenty of
   vertical room, so a tall, full-width rectangle uses that space instead of
   leaving it empty below/beside a small landscape one. Values are half
   extents, tuned independently from the desktop sizes rather than swapped,
   since the desktop height clamp was too narrow to serve as a mobile width. */
const ORBIT_RECT_SIZES_MOBILE = [
  { w: 'clamp(90px, 34vw, 170px)', h: 'clamp(110px, 40vw, 200px)' },
  { w: 'clamp(65px, 25vw, 125px)', h: 'clamp(80px, 29vw, 145px)' },
];
const ORBIT_RING_BASE_DURATION = [26, 18];
const MOBILE_BREAKPOINT = 640;

/* Tailwind, TypeScript, React, Node, MongoDB, and PostgreSQL sit centered
   side by side as the headline skills; everything else orbits around them. */
const CENTER_SKILL_NAMES = [
  'Tailwind CSS',
  'Typescript',
  'React JS',
  'Node JS',
  'MongoDB',
  'Postgresql',
];

export default function WhatIDo() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const allSkills = skillsData as Skill[];
  const uniqueSkills = allSkills.filter(
    (skill, index) => allSkills.findIndex((s) => s.name === skill.name) === index,
  );
  /* On mobile all skills orbit together with no dedicated center group —
     only desktop pulls the headline skills out into a fixed center cluster. */
  const centerSkills = isMobile
    ? []
    : CENTER_SKILL_NAMES.map((name) => uniqueSkills.find((skill) => skill.name === name)).filter(
        (skill): skill is NonNullable<typeof skill> => Boolean(skill),
      );
  const orbitingSkills = uniqueSkills.filter((skill) => !centerSkills.includes(skill));

  return (
    <section
      className="w-full flex flex-col items-center justify-start bg-background relative md:py-20 sm:py-12 py-8"
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

      {/* Card */}
      <div id="skills" className="w-full px-3 md:px-6">
        <div
          className={
            isMobile
              ? 'relative rounded-4xl overflow-hidden backdrop-blur-[18px] shadow-card dark:shadow-card-dark min-h-[clamp(340px,96vw,440px)]'
              : 'relative rounded-4xl overflow-hidden backdrop-blur-[18px] shadow-card dark:shadow-card-dark sm:min-h-125 md:min-h-137.5'
          }
        >
          {/* Dot grid */}
          <div className="dot-texture absolute inset-0 pointer-events-none opacity-45"></div>

          <div className="relative z-10 flex flex-col justify-center items-center p-6 sm:p-8 md:p-11">
            <div
              className={
                isMobile
                  ? 'orbit-stage relative min-h-[clamp(280px,82vw,380px)] w-full grid place-items-center'
                  : 'orbit-stage relative min-h-[clamp(200px,38vw,340px)] w-full grid place-items-center'
              }
              aria-label="Technology stack"
            >
              <div
                className={
                  isMobile
                    ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(180px,68vw,340px)] h-[clamp(220px,80vw,400px)] border border-dashed border-brand/[.22] rounded-3xl'
                    : 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(280px,68vw,960px)] h-[clamp(160px,36vw,380px)] border border-dashed border-brand/[.22] rounded-3xl'
                }
              ></div>
              <div
                className={
                  isMobile
                    ? 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(130px,50vw,250px)] h-[clamp(160px,58vw,290px)] border border-dashed border-brand/[.22] rounded-2xl'
                    : 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[clamp(180px,44vw,600px)] h-[clamp(100px,24vw,240px)] border border-dashed border-brand/[.22] rounded-2xl'
                }
              ></div>

              {centerSkills.length > 0 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-nowrap items-center justify-center gap-1 sm:gap-2">
                  {centerSkills.map((skill) => (
                    <div
                      key={skill.name}
                      className="group relative flex items-center justify-center w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-white dark:bg-[#1b2030] border border-[#e7e9ef] dark:border-[#2b3142] shadow-[0_14px_35px_rgba(26,33,57,.10)] shrink-0"
                    >
                      <Image
                        src={skill.icon as string}
                        alt={skill.name}
                        width={40}
                        height={40}
                        className="w-4.5 h-4.5 sm:w-7 sm:h-7 md:w-9 md:h-9 object-contain"
                      />
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {orbitingSkills.map((skill, i) => {
                const ring = i % 2;
                const indexInRing = Math.floor(i / 2);
                const itemsInRing = Math.ceil((orbitingSkills.length - ring) / 2);
                const duration = ORBIT_RING_BASE_DURATION[ring];
                const delay = -(indexInRing / itemsInRing) * duration;
                const rectSizes = isMobile ? ORBIT_RECT_SIZES_MOBILE : ORBIT_RECT_SIZES;
                return (
                  <div
                    key={skill.name}
                    className="orbit-item"
                    style={
                      {
                        '--orbit-w': rectSizes[ring].w,
                        '--orbit-h': rectSizes[ring].h,
                        animationName: 'orbit-rect',
                        animationDirection: i % 2 === 0 ? 'normal' : 'reverse',
                        animationDuration: `${duration}s`,
                        animationDelay: `${delay}s`,
                      } as React.CSSProperties
                    }
                  >
                    <div className="group relative -ml-3 -mt-3 sm:-ml-3.75 sm:-mt-3.75 flex items-center justify-center p-1.5 sm:p-2.5 rounded-xl sm:rounded-[14px] bg-white dark:bg-[#1b2030] border border-[#e7e9ef] dark:border-[#2b3142]">
                      {skill.icon ? (
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={30}
                          height={30}
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-[9px] object-contain"
                        />
                      ) : (
                        <span
                          className="w-6 h-6 sm:w-7.5 sm:h-7.5 rounded-lg sm:rounded-[9px] grid place-items-center text-[10px] sm:text-[11px] text-white font-black bg-primary"
                          aria-label={skill.name}
                        >
                          {skill.name.trim().slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-10">
                        {skill.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}
