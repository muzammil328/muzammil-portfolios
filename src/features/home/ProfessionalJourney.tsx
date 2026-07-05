'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

interface ExperienceItem {
  _id: string;
  company: string;
  position: string;
  slug?: { current: string };
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
}

async function fetchWorkExperiences() {
  const query = `*[_type == "experience" && isVisible == true]{
    _id,
    company,
    position,
    slug,
    startDate,
    endDate,
    summary,
    highlights
  }`;
  return client.fetch<(ExperienceItem | null)[]>(query);
}

function isExperienceItem(value: ExperienceItem | null): value is ExperienceItem {
  return value !== null;
}

function formatYearMonth(value?: string): string {
  if (!value) return '';

  if (value.toLowerCase() === 'present') return 'Present';

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return value;

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export default function ProfessionalJourney() {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchWorkExperiences();
        setExperiences((data || []).filter(isExperienceItem));
      } catch (error) {
        console.error('Error fetching work experiences:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayExperiences = experiences.length > 0 ? experiences : [];

  return (
    <section id="about" className="lg:py-16 md:py-12 sm:py-8 py-4 container mx-auto md:px-6 px-3">
      <div className="max-w-4xl mx-auto">
        <div className="my-10 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <h2 className="text-[4rem] md:text-[5rem] lg:text-[8rem] font-black mb-16 uppercase text-muted-foreground/20">
              JOURNEY
            </h2>
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-foreground">
            Professional Journey
          </h3>
          <p className="text-base md:text-lg text-muted-foreground">
            My career path and the impact I&apos;ve made along the way.
          </p>
        </div>

        {loading ? (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="relative pl-0 md:pl-20">
                <div className="bg-card border rounded-2xl p-6 animate-pulse">
                  <div className="h-6 w-32 bg-muted rounded mb-4" />
                  <div className="h-8 w-64 bg-muted rounded mb-2" />
                  <div className="h-4 w-full bg-muted rounded mb-2" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>

            <div className="space-y-12">
              {displayExperiences.map((exp, index) => {
                const expSlug = exp.slug?.current;
                const startDateText = formatYearMonth(exp.startDate);
                const endDateText = formatYearMonth(exp.endDate);
                return (
                  <div key={exp._id || index} className="relative pl-0 md:pl-20">
                    <div className="absolute left-6 md:left-6.25 top-0 w-4 h-4 rounded-full bg-primary z-10 hidden md:block"></div>

                    <Link
                      href={expSlug ? `/experiences/${expSlug}` : '/experiences'}
                      className="block bg-card border rounded-2xl p-6 transition-all duration-300 hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                          {startDateText} – {endDateText}
                        </span>
                      </div>

                      <div className="flex items-start gap-3 mb-3">
                        <div>
                          <h4 className="text-2xl font-bold text-foreground mb-1">
                            {exp.position}
                          </h4>
                          <p className="text-lg text-primary font-semibold">{exp.company}</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">{exp.summary}</p>

                      <div className="space-y-2">
                        {(exp.highlights || []).map((achievement, achIndex) => (
                          <div key={achIndex} className="flex items-center gap-3">
                            <span className="text-primary shrink-0">▹</span>
                            <span className="text-foreground text-sm">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* <div className="mt-12 text-center">
              <Link
                href="/experiences"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                View All Experience →
              </Link>
            </div> */}
          </div>
        )}
      </div>
    </section>
  );
}
