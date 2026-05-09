import React from 'react';
import { client } from '@/sanity/lib/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioCard from '@/components/PortfolioCard';
import { ProjectCard } from '@/types/Project';

interface Experience {
  _id: string;
  company: string;
  position: string;
  slug: { current: string };
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  summary: string;
  highlights: string[];
}

async function fetchExperiences() {
  const query = `*[_type == "experience"] | order(startDate desc){
    _id,
    company,
    position,
    slug,
    startDate,
    endDate,
    isCurrent,
    summary,
    highlights
  }`;
  return client.fetch(query);
}

async function fetchProjectsByExperience(slug: string) {
  const query = `*[_type == "project" && company->slug.current == $slug] | order(_createdAt desc){
    _id,
    title,
    slug,
    mainImage,
    description,
    liveLink,
    githubLink,
    "category": category->name,
    "skills": skills[]->name
  }`;
  return client.fetch(query, { slug });
}

export const metadata = {
  title: 'Experience | Muzammil Safdar',
  description: 'My work experience and professional journey.',
};

export default async function Page() {
  const experiences = (await fetchExperiences()) as Experience[];

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

          {experiences.length > 0 ? (
            <div className="space-y-16">
              {experiences.map(async exp => {
                const startDateText = formatDate(exp.startDate);
                const endDateText = exp.isCurrent === true ? 'Present' : formatDate(exp.endDate);
                const duration = endDateText ? `${startDateText} - ${endDateText}` : startDateText;

                const expSlug = exp.slug?.current;
                const relatedProjects = expSlug
                  ? ((await fetchProjectsByExperience(expSlug)) as ProjectCard[])
                  : [];

                return (
                  <div
                    key={exp._id}
                    className="rounded-2xl border border-border/70 bg-card p-6 md:p-8"
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <h2 className="text-3xl font-bold mb-1">{exp.company}</h2>
                        <p className="text-xl text-muted-foreground mb-2">{exp.position}</p>
                        <p className="text-sm text-muted-foreground">{duration}</p>
                      </div>
                    </div>

                    {exp.summary && (
                      <div className="mb-6">
                        <p className="text-lg text-muted-foreground leading-relaxed">
                          {exp.summary}
                        </p>
                      </div>
                    )}

                    {exp.highlights && exp.highlights.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-sm uppercase tracking-widest opacity-50 mb-4 font-semibold">
                          Key Highlights
                        </h3>
                        <ul className="space-y-3">
                          {exp.highlights.map((highlight, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                              <span className="text-foreground">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {relatedProjects.length > 0 && (
                      <div>
                        <h3 className="text-sm uppercase tracking-widest opacity-50 mb-4 font-semibold">
                          Projects at {exp.company}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {relatedProjects.map((project, index) => (
                            <PortfolioCard key={project._id} data={project} index={index} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-border/70 bg-muted/30 p-8 text-center">
              <p className="text-muted-foreground">No experience found yet.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
