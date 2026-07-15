'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CV_FILE } from '@/constants/index';
import { downloadFile } from '@/utils/downloadFile';
import { ProfileTypes } from '@/types/Profile';
import { GitHubIcon, LinkedInIcon } from '@/components/ui';
import { motion, useScroll, useTransform } from 'framer-motion';

const TAGLINES = [
  'Building Digital Experiences',
  'Crafting Scalable Solutions',
  'Transforming Ideas into Code',
];

interface HeroSectionProps {
  profile: ProfileTypes | null;
}

function Typewriter({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex(index + 1);
      }, 50);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [index, text]);

  return (
    <span className="text-primary md:text-3xl text-2xl">
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function HeroSection({ profile }: HeroSectionProps) {
  const containerRef = React.useRef<HTMLElement>(null);
  const [taglineIndex, setTaglineIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const defaultProfile = {
    name: 'Muzammil Safdar',
    label: 'Full Stack Developer',
    summary:
      'With over a year of hands-on experience, I have honed my skills in developing dynamic and responsive web applications. My journey as a developer has been driven by a passion for crafting efficient and scalable solutions.',
    profiles: [
      {
        network: 'GitHub',
        username: 'Muzammil327',
        url: 'https://github.com/Muzammil327',
      },
      {
        network: 'LinkedIn',
        username: 'mmuzammilsafdar',
        url: 'https://www.linkedin.com/in/mmuzammilsafdar/',
      },
    ],
  };

  const displayProfile = profile || defaultProfile;

  return (
    <header
      ref={containerRef}
      id="home"
      className="container mx-auto md:py-16 sm:py-8 py-4 px-2 relative overflow-hidden"
    >


      <div className="flex flex-col lg:flex-row items-center lg:gap-24 gap-12">
        <motion.div style={{ y: textY }} className="w-full lg:w-2/3 md:mt-12 sm:mt-8 mt-4 z-10">
          <span className="inline-block text-foreground text-4xl">
            I&apos;m {displayProfile.name}
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-[6rem] leading-tight font-bold">
            {displayProfile.label}
            <br />
            in Pakistan
          </h1>

          <div className="mt-4 h-8">
            <Typewriter key={taglineIndex} text={TAGLINES[taglineIndex]} />
          </div>

          <p className="mt-6 text-muted-foreground md:text-lg text-base inline-block">
            Building Scalable MVPs, SAAS & Real Time Web Applications. Turning complex problems into
            elegant solutions.
          </p>

          <div className="mt-8 flex flex-col gap-6">
            <button
              onClick={() => downloadFile(CV_FILE.url, CV_FILE.name)}
              className="bg-primary cursor-pointer text-primary-foreground w-52 h-12 flex items-center justify-center border border-border rounded-full text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Download Resume
            </button>

            <div className="lg:hidden block max-w-md">
              <span className="text-base font-semibold flex flex-col gap-1">Follow Me</span>

              <div className="flex items-center gap-3 my-2">
                {displayProfile.profiles?.map((social, i) => {
                  const lower = social.network?.toLowerCase() || '';
                  return (
                    <Link
                      key={i}
                      href={social.url || '#'}
                      target="_blank"
                      aria-label={social.network || 'Social profile'}
                      className="w-9 h-9 p-1 flex items-center justify-center rounded-full border border-border"
                    >
                      {lower.includes('linkedin') ? <LinkedInIcon /> : <GitHubIcon />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          style={{ y: imageY }}
          className="w-full lg:w-1/3 flex justify-center lg:justify-end z-0"
        >
          {profile?.image && (
            <Image
              src={profile.image}
              alt={displayProfile.name}
              width={480}
              height={480}
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 480px"
              className="w-full max-w-70 sm:max-w-90 lg:max-w-120 h-auto aspect-square object-cover rounded-2xl"
              priority
              fetchPriority="high"
            />
          )}
          {!profile?.image && (
            <Image
              src="/Muhammad-Muzammil-Safdar.jpeg"
              alt="Portrait"
              width={480}
              height={480}
              sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 480px"
              className="w-full max-w-70 sm:max-w-90 lg:max-w-120 h-auto aspect-square object-cover rounded-2xl"
              priority
              fetchPriority="high"
            />
          )}
        </motion.div>
      </div>
    </header>
  );
}
