import profileData from '@/data/profile.json';
import projectsData from '@/data/projects.json';
import servicesData from '@/data/services.json';
import { ProjectCard, ProjectDetail } from '@/types/Project';
import { ServiceTypes } from '@/types/Service';
import { PortableTextBlock } from '@portabletext/react';

type RawSkill = {
  name: string;
  icon: string | null;
  color?: string | null;
  proficiency?: string | null;
  yearsUsed?: number | null;
  featured?: boolean | null;
};

function toServiceSkill(skill: RawSkill): ServiceTypes['skills'][number] {
  return {
    name: skill.name,
    icon: skill.icon,
    color: skill.color ?? undefined,
    proficiency: (skill.proficiency as ServiceTypes['skills'][number]['proficiency']) ?? undefined,
    yearsUsed: skill.yearsUsed ?? undefined,
    featured: skill.featured ?? undefined,
  };
}

type RawProject = (typeof projectsData)[number];

function toProjectCard(project: RawProject): ProjectCard {
  return {
    _id: project._id,
    title: project.title,
    slug: project.slug,
    description: project.description ?? '',
    mainImage: project.mainImage,
    company: project.company ?? undefined,
    companySlug: project.companySlug ?? undefined,
    skills: project.skills.map((skill) => skill.name),
    liveLink: project.liveLink ?? '/',
    githubLink: project.githubLink ?? '/',
    role: project.role ?? undefined,
    teamSize: project.teamSize ?? undefined,
    duration: project.duration ?? undefined,
    priority: project.priority ?? undefined,
  };
}

export async function getProjects(): Promise<ProjectCard[]> {
  return projectsData.map(toProjectCard);
}

type RawService = (typeof servicesData)[number];

function toServiceType(service: RawService): ServiceTypes {
  return {
    _id: service._id,
    name: service.name,
    slug: service.slug,
    image: service.image,
    summary: service.summary ?? undefined,
    focus: service.focus,
    deliverables: service.deliverables ?? undefined,
    processSteps: service.processSteps ?? undefined,
    idealClient: service.idealClient ?? undefined,
    timeline: service.timeline ?? undefined,
    pricing: service.pricing ?? undefined,
    isFeatured: service.isFeatured ?? undefined,
    proofPoints: service.proofPoints ?? undefined,
    testimonials: service.testimonials ?? undefined,
    skills: service.skills.map(toServiceSkill),
  };
}

export async function getServices(): Promise<ServiceTypes[]> {
  return servicesData.map(toServiceType);
}

export async function getServiceBySlug(slug: string): Promise<ServiceTypes | null> {
  const service = servicesData.find((item) => item.slug === slug);
  return service ? toServiceType(service) : null;
}

export async function getProjectsByCategorySlug(): Promise<ProjectCard[]> {
  // Projects are not linked to categories in the source data.
  return [];
}

export async function getProjectBySlugDetailed(slug: string): Promise<ProjectDetail | null> {
  const project = projectsData.find((item) => item.slug === slug);
  if (!project) return null;

  return {
    title: project.title,
    slug: project.slug,
    mainImage: project.mainImage,
    sliderImages: project.sliderImages,
    description: project.description ?? undefined,
    role: project.role ?? undefined,
    duration: project.duration ?? undefined,
    teamSize: project.teamSize ?? undefined,
    liveLink: project.liveLink ?? '/',
    githubLink: project.githubLink ?? '/',
    figmaDesign: project.figmaDesign ?? undefined,
    company: project.company
      ? { company: project.company, slug: project.companySlug ?? '' }
      : undefined,
    skillNames: project.skills.map((skill) => ({ name: skill.name, icon: skill.icon })),
    body: project.body as PortableTextBlock[],
    relatedProjects: project.relatedProjects.map((related) => ({
      title: related.title,
      slug: related.slug,
      mainImage: related.mainImage,
      description: related.description ?? '',
      role: related.role ?? undefined,
      teamSize: related.teamSize ?? undefined,
      duration: related.duration ?? undefined,
    })),
  };
}

export async function getPortfolioSocialProfiles(): Promise<{
  profiles: { network: string; username: string; url: string }[];
} | null> {
  return { profiles: profileData.profiles };
}
