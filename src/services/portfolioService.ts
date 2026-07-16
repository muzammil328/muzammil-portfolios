import profileData from '@/data/profile.json';
import projectsData from '@/data/projects.json';
import { ProjectCard, ProjectDetail } from '@/types/Project';

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
    body: project.body,
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
