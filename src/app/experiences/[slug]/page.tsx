import React from 'react';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PortfolioCard from '@/components/PortfolioCard';
import ExperienceMilestones from '@/components/ExperienceMilestones';
import { ProjectCard } from '@/types/Project';

interface RelatedService {
  _id: string;
  name: string;
  slug: { current: string };
  summary?: string;
}

interface Experience {
  _id: string;
  company: string;
  position: string;
  slug: { current: string };
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  summary: string;
  highlights: string[];
  milestones: {
    _key: string;
    title: string;
    type: string;
    description?: string;
    date?: string;
    link?: string;
    imageUrls?: string[];
  }[];
}

async function fetchExperience(slug: string) {
  const query = `*[_type == "experience" && slug.current == $slug][0]{
    _id,
    company,
    position,
    slug,
    "imageUrl": image.asset->url,
    startDate,
    endDate,
    isCurrent,
    summary,
    highlights,
    milestones[]{
      _key,
      title,
      type,
      description,
      date,
      link,
      "imageUrls": images[].asset->url
    }
  }`;
  return client.fetch(query, { slug });
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
    "company": company->company,
    "companySlug": company->slug.current,
    "category": category->name,
    "skills": skills[]->name
  }`;
  return client.fetch(query, { slug });
}

async function fetchRelatedServicesByExperience(slug: string) {
  const query = `*[_type == "service" && slug.current in *[_type == "project" && company->slug.current == $slug].category->slug.current]{
    _id,
    name,
    slug,
    summary
  }`;

  return client.fetch(query, { slug });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const experience = (await fetchExperience(slug)) as Experience | null;

  if (!experience) {
    return {
      title: 'Experience Not Found | Muzammil Safdar',
      description: 'The requested experience could not be found.',
    };
  }

  return {
    title: `${experience.company} | Experience | Muzammil Safdar`,
    description:
      experience.summary ||
      `${experience.position} experience at ${experience.company}. Explore highlights and related projects.`,
    openGraph: {
      title: `${experience.company} | Experience | Muzammil Safdar`,
      description:
        experience.summary ||
        `${experience.position} experience at ${experience.company}. Explore highlights and related projects.`,
      type: 'article',
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function ExperienceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [experience, relatedProjects, relatedServices] = (await Promise.all([
    fetchExperience(slug),
    fetchProjectsByExperience(slug),
    fetchRelatedServicesByExperience(slug),
  ])) as [Experience | null, ProjectCard[], RelatedService[]];

  const formatDate = (date?: string) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  if (!experience) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Experience Not Found</h1>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const startDateText = formatDate(experience.startDate);
  const endDateText = experience.isCurrent === true ? 'Present' : formatDate(experience.endDate);
  const duration = endDateText ? `${startDateText} - ${endDateText}` : startDateText;
  const filteredExperienceHref = `/portfolio?${new URLSearchParams({ company: experience.company }).toString()}`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-2">
          <div className="mb-8 grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-2 tracking-tight">
                {experience.company}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-1">
                {experience.position}
              </p>
              <p className="text-sm text-muted-foreground mb-4">{duration}</p>

              {experience.summary && (
                <div className="mb-4">
                  <h2 className="text-sm uppercase tracking-widest opacity-50 mb-4 font-semibold">
                    Overview
                  </h2>
                  <p className="text-lg leading-relaxed">{experience.summary}</p>
                </div>
              )}
              {experience.highlights && experience.highlights.length > 0 && (
                <div>
                  <h2 className="text-sm uppercase tracking-widest opacity-50 mb-2 font-semibold">
                    Key Highlights
                  </h2>
                  <ul className="space-y-4">
                    {experience.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground/50 shrink-0" />
                        <span className="text-lg">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {experience.imageUrl && (
              <div className="rounded-2xl border border-border/70 bg-card overflow-hidden">
                <img
                  src={experience.imageUrl}
                  alt={`${experience.company} cover`}
                  className="w-full h-64 md:h-80 object-cover object-center"
                />
              </div>
            )}
          </div>

          {experience.milestones && experience.milestones.length > 0 && (
            <section className="mt-16">
              <h2 className="text-sm uppercase tracking-widest opacity-50 mb-6 font-semibold">
                Milestones & Achievements
              </h2>
              <ExperienceMilestones milestones={experience.milestones} />
            </section>
          )}

          {relatedProjects.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Projects at {experience.company}
                </h2>
                <Link
                  href={filteredExperienceHref}
                  className="text-primary hover:underline font-medium"
                >
                  View all projects
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProjects.map((project, index) => (
                  <PortfolioCard key={project._id} data={project} index={index} />
                ))}
              </div>
            </section>
          )}

          {relatedServices.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Related Services</h2>
                <Link href="/services" className="text-primary hover:underline font-medium">
                  View all services
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {relatedServices.slice(0, 4).map((service) => (
                  <Link
                    key={service._id}
                    href={`/services/${service.slug?.current}`}
                    className="rounded-2xl border border-border/70 bg-card p-5 hover:bg-muted/30 transition-colors"
                  >
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                    {service.summary && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {service.summary}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
