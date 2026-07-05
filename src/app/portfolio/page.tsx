import React from 'react';
import PortfolioCard from '@/components/PortfolioCard';
import { getProjects } from '@/services/portfolioService';
import Navbar from '@/components/Navbar';
import { ProjectCard } from '@/types/Project';

export const metadata = {
  title: 'Portfolio | Muzammil Safdar',
  description:
    'Explore my portfolio of web development projects, SaaS applications, and custom solutions.',
  robots: {
    index: false,
    follow: false,
  },
};

type PortfolioSearchParams = Record<string, string | string[] | undefined>;

function firstParam(params: PortfolioSearchParams, key: string) {
  const value = params[key];
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<PortfolioSearchParams>;
}) {
  const params = await searchParams;
  const companyFilter = firstParam(params, 'company').trim().toLowerCase();

  let projects: ProjectCard[] = [];

  try {
    projects = await getProjects();
  } catch (error) {
    console.error('Error fetching projects:', error);
  }

  const filteredProjects = companyFilter
    ? projects.filter((project) => (project.company || '').trim().toLowerCase() === companyFilter)
    : projects;

  const filterBadgeLabel = filteredProjects[0]?.company || firstParam(params, 'company').trim();

  return (
    <div className="mt-2">
      <Navbar />
      <section className="h-104 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold">My Portfolio</h1>
          {companyFilter ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Filtered by company: <span className="font-semibold">{filterBadgeLabel}</span>
            </p>
          ) : null}
        </div>
      </section>
      {filteredProjects.length > 0 ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full px-4 border-t border-zinc-200 dark:border-zinc-900">
          {filteredProjects.map((project, index: number) => (
            <div
              key={project._id}
              className="h-full px-4 flex items-center justify-center w-full border-x border-b border-zinc-200 dark:border-zinc-900 last:border-l-0 py-4"
            >
              <PortfolioCard data={project} index={index} />
            </div>
          ))}
        </section>
      ) : (
        <section className="px-4 pb-16">
          <div className="max-w-3xl mx-auto rounded-2xl border border-border/70 bg-muted/30 p-8 text-center">
            <p className="text-muted-foreground">
              {companyFilter
                ? `No projects found for company \"${firstParam(params, 'company').trim()}\".`
                : 'No projects found.'}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
