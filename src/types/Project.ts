export interface ProjectCard {
  _id: string;
  title: string;
  slug: string;
  description: string;
  mainImage: string | null;
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
  slug: string;
  mainImage: string | null;
  sliderImages: string[];
  description?: string;
  role?: string;
  duration?: string;
  teamSize?: string;
  liveLink: string;
  githubLink: string;
  figmaDesign?: string;
  company?: {
    company: string;
    slug: string;
  };
  skillNames: {
    name: string;
    icon?: string | null;
  }[];
  body?: string;
  relatedProjects?: {
    description: string;
    title: string;
    slug: string;
    mainImage: string | null;
    role?: string;
    teamSize?: string;
    duration?: string;
  }[];
}
