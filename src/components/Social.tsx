'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import { Button } from '@/components/ui';
import { GitHubIcon, LinkedInIcon } from '@/components/ui';

type SocialItem = {
  name: 'github' | 'linkedin';
  url?: string;
};

type SocialProps = {
  links: SocialItem[];
};

const ICON_MAP = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
};

export function Social({ links }: SocialProps) {
  const variants = {
    hidden: () => ({ y: '100%', opacity: 0 }),
    visible: (delay: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay, duration: 0.4 + delay * 0.1 },
    }),
  };

  return (
    <section className="flex gap-2">
      {links.map((item, idx) => {
        const { name, url = '/' } = item;
        const Icon = ICON_MAP[name];

        return (
          <motion.div
            key={name}
            custom={0.5 + idx * 0.1}
            initial="hidden"
            whileInView="visible"
            variants={variants}
          >
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href={url}
                  target="_blank"
                  title={name.charAt(0).toUpperCase() + name.slice(1)}
                >
                  <Button title={name} size="icon" variant="destructive" className="rounded-full">
                    <Icon />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>{name.charAt(0).toUpperCase() + name.slice(1)}</TooltipContent>
            </Tooltip>
          </motion.div>
        );
      })}
    </section>
  );
}
