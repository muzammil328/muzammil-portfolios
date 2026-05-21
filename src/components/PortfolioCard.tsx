'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Users, Clock } from 'lucide-react';
import { GitHubIcon } from '@muzammil328/icon';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@muzammil328/ui';
import { getImageSrc } from '@/utils/getImageSrc';
import { ProjectCard } from '@/types/Project';

const roleMap: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  fullstack: 'Full Stack',
};

const teamSizeMap: Record<string, string> = {
  '1': 'Solo',
  '2': '2 People',
  '3-5': '3-5 People',
  '5-10': '5-10 People',
  '10-20': '10-20 People',
  '20+': '20+ People',
};

const durationMap: Record<string, string> = {
  'less-1-month': '< 1 month',
  '1-3-months': '1-3 months',
  '3-6-months': '3-6 months',
  '6-12-months': '6-12 months',
  'more-1-year': '1+ year',
  ongoing: 'Ongoing',
};

function getDetailLink(data: ProjectCard): string {
  if (data.slug?.current) return data.slug.current;
  return '#';
}

function getDescription(data: ProjectCard): string {
  if (data.description) return data.description;
  return 'No description available';
}

function getTags(data: ProjectCard): string[] {
  return data.skills || [];
}

function getRoleLabel(role?: string): string {
  if (!role) return '';
  return roleMap[role] || role;
}

function getTeamSizeLabel(teamSize?: string): string {
  if (!teamSize) return '';
  return teamSizeMap[teamSize] || teamSize;
}

function getDurationLabel(duration?: string): string {
  if (!duration) return '';
  return durationMap[duration] || duration;
}

export default function PortfolioCard({ data, index = 0 }: { data: ProjectCard; index?: number }) {
  const tags = getTags(data);
  const roleLabel = getRoleLabel(data.role);
  const teamSizeLabel = getTeamSizeLabel(data.teamSize);
  const durationLabel = getDurationLabel(data.duration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="group h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50">
        {/* Image Section */}
        <Link
          href={`/portfolio/${getDetailLink(data)}`}
          className="relative aspect-video w-full block cursor-pointer overflow-hidden"
        >
          {/* Parent container — make sure this has a defined height */}
          <div className="relative w-full h-full"> {/* or h-48, h-72, adjust as needed */}
            <Image
              src={getImageSrc(data, 1200)}
              alt={data.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
            <span className="bg-black text-white dark:bg-background/90 px-4 py-2 rounded-full font-medium text-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
              View Details
            </span>
          </div>
          {/* Category Badge */}
          {data.category && (
            <div className="absolute top-4 left-4">
              <Badge
                variant="primary_solid"
                className="backdrop-blur-md bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {data.category}
              </Badge>
            </div>
          )}
        </Link>

        {/* Content Section */}
        <div className="flex flex-col md:p-6 p-3 border-5 ">
          <div className="mb-4">
            {/* Role, Team Size, Duration badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {roleLabel && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-muted text-muted-foreground">
                  {roleLabel} Developer
                </span>
              )}
              {teamSizeLabel && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-muted text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {teamSizeLabel}
                </span>
              )}
              {durationLabel && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md bg-muted text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {durationLabel}
                </span>
              )}
            </div>
            <div className="flex justify-between items-start mb-2">
              <Link
                href={`/portfolio/${getDetailLink(data)}`}
                className="hover:text-primary transition-colors"
              >
                <h3 className="text-2xl font-bold line-clamp-1" title={data.title}>
                  {data.title}
                </h3>
              </Link>
              <div className="flex gap-2 py-2">
                {data.liveLink && data.liveLink !== '/' && (
                  <Link
                    href={data.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </Link>
                )}
                {data.githubLink && data.githubLink !== '/' && (
                  <Link
                    href={data.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <GitHubIcon className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
            <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
              {getDescription(data)}
            </p>
          </div>

          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 6).map((tag: string, i: number) => (
                <span
                  key={i}
                  className="text-xs font-medium px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 6 && (
                <span className="text-xs font-medium px-2 py-1 rounded-md bg-secondary/50 text-secondary-foreground">
                  +{tags.length - 6}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
