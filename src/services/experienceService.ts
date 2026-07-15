import experiencesData from '@/data/experiences.json';
import { ExperienceItem } from '@/types/Experience';
import { ProjectCard } from '@/types/Project';
import { getProjects } from '@/services/portfolioService';

type RawExperience = (typeof experiencesData)[number];

function toExperienceItem(experience: RawExperience): ExperienceItem {
  return {
    _id: experience._id,
    company: experience.company,
    companyUrl: experience.companyUrl ?? undefined,
    position: experience.position,
    slug: experience.slug,
    image: experience.image,
    isVisible: experience.isVisible ?? undefined,
    isCurrent: experience.isCurrent ?? undefined,
    location: experience.location ?? undefined,
    startDate: experience.startDate ?? undefined,
    endDate: experience.endDate ?? undefined,
    summary: experience.summary ?? undefined,
    highlights: experience.highlights,
    milestones: experience.milestones,
  };
}

export async function getExperiences(): Promise<ExperienceItem[]> {
  return experiencesData
    .map(toExperienceItem)
    .sort(
      (a, b) => new Date(b.startDate ?? 0).getTime() - new Date(a.startDate ?? 0).getTime(),
    );
}

export async function getVisibleExperiences(): Promise<ExperienceItem[]> {
  const experiences = await getExperiences();
  return experiences.filter((experience) => experience.isVisible === true);
}

export async function getExperienceBySlug(slug: string): Promise<ExperienceItem | null> {
  const experience = experiencesData.find((item) => item.slug === slug);
  return experience ? toExperienceItem(experience) : null;
}

export async function getProjectsByExperienceSlug(slug: string): Promise<ProjectCard[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.companySlug === slug);
}
