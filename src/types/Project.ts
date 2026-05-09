import { SanityImageType, SanitySlugType } from '@muzammil328/sanity';
import { PortableTextBlock } from '@portabletext/react';

export interface ProjectCard {
  _id: string;
  title: string;
  slug: SanitySlugType;
  description: string;
  mainImage: SanityImageType;
  category: string;
  company?: string;
  companySlug?: string;
  skills: string[];
  liveLink: string;
  githubLink: string;
  role?: string;
  teamSize?: string;
  duration?: string;
  priority?: number;
}

export interface ProjectDetail {
  title: string;
  mainImage: SanityImageType;
  sliderImages: SanityImageType[];
  description?: string;
  role?: string;
  duration?: string;
  teamSize?: string;
  liveLink: string;
  githubLink: string;
  figmaDesign?: string;
  category: string;
  company?: {
    company: string;
    slug: string;
  };
  skillNames: {
    name: string;
    icon?: SanityImageType;
  }[];
  features: PortableTextBlock[];
  problem?: PortableTextBlock[];
  solution?: PortableTextBlock[];
  research?: PortableTextBlock[];
  myRole?: PortableTextBlock[];
  techStack?: PortableTextBlock[];
  outcome?: PortableTextBlock[];
  takeaways?: PortableTextBlock[];
  relatedProjects?: {
    category: string;
    description: string;
    title: string;
    slug: SanitySlugType;
    mainImage: SanityImageType;
    role?: string;
    teamSize?: string;
    duration?: string;
  }[];
}
