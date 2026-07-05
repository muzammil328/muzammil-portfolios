'use client';
import React, { useEffect, useState } from 'react';
import { client } from '@/sanity/lib/portfolio';

interface EducationItem {
  _id?: string;
  institution: string;
  area: string;
  studyType: string;
  startDate?: string;
  endDate?: string;
  score?: string;
}

async function fetchEducation() {
  const query = `*[_type == "education"] | order(startDate desc){
    _id,
    institution,
    area,
    studyType,
    startDate,
    endDate,
    score
  }`;
  return client.fetch<(EducationItem | null)[]>(query);
}

function isEducationItem(value: EducationItem | null): value is EducationItem {
  return value !== null;
}

function formatEducationDate(date?: string): string {
  if (!date) return '';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
}

export default function Education() {
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchEducation();
        setEducation((data || []).filter(isEducationItem));
      } catch (error) {
        console.error('Error fetching education:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <section id="about" className="lg:py-16 md:py-12 sm:py-8 py-4 container mx-auto md:px-6 px-3">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="my-10 text-center relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <h2 className="text-[4rem] md:text-[5rem] lg:text-[8rem] font-black mb-12 uppercase text-muted-foreground/20">
              EDUCATION
            </h2>
          </div>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 text-foreground">
            Educational Background
          </h3>
          <p className="text-base md:text-lg text-muted-foreground">
            My academic journey and qualifications.
          </p>
        </div>

        {loading ? (
          <div className="space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="relative pl-0 md:pl-10">
                <div className="bg-card border rounded-2xl p-6 animate-pulse">
                  <div className="h-6 w-28 bg-muted rounded mb-4" />
                  <div className="h-8 w-56 bg-muted rounded mb-2" />
                  <div className="h-5 w-40 bg-muted rounded mb-4" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {education.length === 0 ? (
              <div className="bg-card border rounded-2xl p-6 text-center text-muted-foreground">
                No education records found in Sanity.
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-border hidden md:block"></div>

                <div className="space-y-12">
                  {education.map((item, index) => {
                    const startDateText = formatEducationDate(item.startDate);
                    const endDateText = formatEducationDate(item.endDate);
                    const dateRange =
                      startDateText && endDateText
                        ? `${startDateText} - ${endDateText}`
                        : startDateText || endDateText || 'Date not provided';

                    return (
                      <div key={index} className="relative pl-0 md:pl-10">
                        <div className="absolute left-6 md:-left-1.75 top-0 w-4 h-4 rounded-full bg-primary z-10 hidden md:block"></div>

                        <div className="bg-card border rounded-2xl p-6 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="px-4 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20">
                              {dateRange}
                            </span>
                          </div>

                          <div className="flex items-start gap-3 mb-3">
                            <div>
                              <h4 className="text-2xl font-bold text-foreground mb-1">
                                {item.studyType} in {item.area}
                              </h4>
                              <p className="text-lg text-primary font-semibold">
                                {item.institution}
                              </p>
                            </div>
                          </div>

                          {item.score && (
                            <div className="flex items-center gap-2 mb-4">
                              <span className="text-sm text-muted-foreground">
                                GPA: {item.score}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
