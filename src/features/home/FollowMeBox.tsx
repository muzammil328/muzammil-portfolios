'use client';
import React, { useState, useEffect } from 'react';
import { GitHubIcon, LinkedInIcon } from '@/components/ui';
import { getPortfolioSocialProfiles } from '@/services/portfolioService';
import Link from 'next/link';

interface SocialProfile {
  network: string;
  username: string;
  url: string;
}

function getSocialIcon(network: string) {
  const lower = network?.toLowerCase() || '';

  if (lower.includes('linkedin')) {
    return <LinkedInIcon size={18} />;
  }

  if (lower.includes('github')) {
    return <GitHubIcon size={18} />;
  }

  return <GitHubIcon size={18} />;
}

export default function FollowMeBox() {
  const [profiles, setProfiles] = useState<SocialProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPortfolioSocialProfiles();
        if (data?.profiles) {
          setProfiles(data.profiles);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayProfiles = profiles.length > 0 ? profiles : [];

  return (
    <div className="max-w-md lg:flex hidden flex-col items-center gap-6 absolute left-4 top-[20%] transform -translate-y-1/2">
      <span className="text-base font-semibold rotate-90">Follow</span>

      <svg
        className=""
        width="6"
        height="41"
        viewBox="0 0 6 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.5 1C3.5 0.723858 3.27614 0.5 3 0.5C2.72386 0.5 2.5 0.723858 2.5 1H3.5ZM3 41L5.88675 36H0.113249L3 41ZM2.5 1L2.5 36.5H3.5L3.5 1H2.5Z"
          fill="currentColor"
        ></path>
      </svg>

      {loading ? (
        <div className="flex flex-col items-center gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-9 h-9 rounded-full bg-muted animate-pulse" />
          ))}
        </div>
      ) : displayProfiles.length === 0 ? (
        <p className="text-sm text-muted-foreground">No profiles found.</p>
      ) : (
        <div className="flex flex-col items-center gap-3">
          {displayProfiles.slice(0, 4).map((social, i) => (
            <Link
              key={i}
              href={social.url || '#'}
              target="_blank"
              aria-label={social.network || 'Social profile'}
              className="w-9 h-9 p-1 flex items-center justify-center rounded-full border border-border hover:border-primary transition-colors"
            >
              {getSocialIcon(social.network)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
