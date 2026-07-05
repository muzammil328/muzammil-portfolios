import { client } from '@/sanity/lib/client';
import { ProjectCard, ProjectDetail } from '@/types/Project';
import { ServiceTypes } from '@/types/Service';

type PortfolioSocialResponse = {
  profiles: {
    network: string;
    username: string;
    url: string;
  }[];
};

type EducationItem = {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  score?: string;
};

type ExperienceItem = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  summary: string;
  highlights: string[];
};

export async function getProjects(): Promise<ProjectCard[]> {
  const query = `*[_type == "project"] | order(priority asc) {
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
    "skills": skills[]->name,
    role,
    teamSize,
    duration,
    priority
  }`;

  return client.fetch(query);
}

export async function getServices(): Promise<ServiceTypes[]> {
  const query = `*[_type == "service"] | order(_createdAt asc) {
    _id,
    name,
    slug,
    image,
    focus,
    "skills": skills[]->{name, icon, color, proficiency, yearsUsed, featured}
  }`;

  return client.fetch(query);
}

export async function getServiceBySlug(slug: string): Promise<ServiceTypes | null> {
  const query = `*[_type == "service" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    image,
    focus,
    "skills": skills[]->{name, icon, color, proficiency, yearsUsed, featured}
  }`;

  return client.fetch(query, { slug });
}

export async function getProjectsByCategorySlug(slug: string): Promise<ProjectCard[]> {
  const query = `*[_type == "project" && category->slug.current == $slug] | order(priority asc){
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
    "skills": skills[]->name,
    role,
    teamSize,
    duration,
    priority
  }`;

  return client.fetch(query, { slug });
}

export async function getProjectBySlugDetailed(slug: string): Promise<ProjectDetail | null> {
  const query = `*[_type == "project" && slug.current == $slug][0]{
    title,
    mainImage,
    "sliderImages": sliderImages[]{ _key, _type, asset },
    description,
    role,
    duration,
    teamSize,
    liveLink,
    githubLink,
    figmaDesign,
    "category": category->name,
    "company": company->{company, "slug": slug.current},
    "skillNames": skills[]->{ name, icon },
    features,
    "relatedProjects": relatedProjects[]->{
      title,
      slug,
      mainImage,
      description,
      "category": category->name,
      role,
      teamSize,
      duration
    },
    problem,
    solution,
    research,
    userFlowImplementation,
    implementation,
    outcome,
    takeaways
  }`;

  return client.fetch(query, { slug });
}

export async function getPortfolioSocialProfiles(): Promise<PortfolioSocialResponse | null> {
  const query = `*[_type == "portfolio"][0]{ "profiles": profiles[]{ network, username, url } }`;
  return client.fetch(query);
}

export async function getEducation(): Promise<EducationItem[]> {
  const query = `*[_type == "portfolio"][0].education`;
  return client.fetch(query);
}

export async function getWorkExperiences(): Promise<ExperienceItem[]> {
  const query = `*[_type == "portfolio"][0].workExperience`;
  return client.fetch(query);
}
