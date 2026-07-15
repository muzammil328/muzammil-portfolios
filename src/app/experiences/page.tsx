import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getExperiences } from '@/services/experienceService';

export const metadata = {
  title: 'Experience | Muzammil Safdar',
  description: 'My work experience and professional journey.',
  openGraph: {
    title: 'Experience | Muzammil Safdar',
    description: 'My work experience and professional journey.',
    type: 'website',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const experiences = await getExperiences();

  const selectedCompany = typeof params.company === 'string' ? params.company.trim() : '';
  const normalizedCompany = selectedCompany.toLowerCase();

  const filteredExperiences = experiences
    .filter((exp) => {
      if (!normalizedCompany) return true;
      return exp.company.trim().toLowerCase() === normalizedCompany;
    })
    .sort((a, b) => {
      const aDate = new Date(a.startDate || 0).getTime();
      const bDate = new Date(b.startDate || 0).getTime();
      return bDate - aDate;
    });

  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-12 tracking-tight">Experience</h1>

          {selectedCompany ? (
            <p className="text-sm text-muted-foreground mb-8">
              Filtered by company: <span className="font-semibold">{selectedCompany}</span>
            </p>
          ) : null}

          {filteredExperiences.length > 0 ? (
            <div id="experience-results" className="space-y-6 scroll-mt-32">
              {filteredExperiences.map((exp) => {
                const expSlug = exp.slug || exp._id;
                const startDateText = formatDate(exp.startDate);
                const endDateText = exp.isCurrent === true ? 'Present' : formatDate(exp.endDate);
                const duration = endDateText ? `${startDateText} - ${endDateText}` : startDateText;

                return (
                  <Link key={exp._id} href={`/experiences/${expSlug}`} className="group block">
                    <div className="rounded-2xl border border-border/70 bg-card p-6 transition-colors hover:bg-muted/50">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold mb-1">{exp.company}</h2>
                          <p className="text-lg text-muted-foreground mb-2">{exp.position}</p>
                          {exp.summary && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {exp.summary}
                            </p>
                          )}
                        </div>

                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                          {duration}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">
                {selectedCompany
                  ? `No experiences found for company "${selectedCompany}".`
                  : 'No experiences found.'}
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
