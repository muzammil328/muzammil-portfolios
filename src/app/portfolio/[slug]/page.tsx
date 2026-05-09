import type { Metadata } from 'next';
import { client } from '@/sanity/lib/client';
import PortfolioDetailClient from './PortfolioDetailClient';

async function fetchProjectMeta(slug: string) {
  const query = `*[_type == "project" && slug.current == $slug][0]{
    title,
    description
  }`;

  return client.fetch(query, { slug });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await fetchProjectMeta(slug);

  if (!project) {
    return {
      title: 'Project Not Found | Muzammil Safdar',
      description: 'The requested project could not be found.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${project.title} | Portfolio | Muzammil Safdar`,
    description: project.description || `Explore ${project.title} in my project portfolio.`,
    alternates: {
      canonical: `/portfolio/${slug}`,
    },
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PortfolioDetailClient slug={slug} />;
}
