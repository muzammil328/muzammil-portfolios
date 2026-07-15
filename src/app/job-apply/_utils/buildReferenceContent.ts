import { fetchProfile } from '@/services/profileService';
import { getVisibleExperiences } from '@/services/experienceService';
import { getProjects } from '@/services/portfolioService';
import { ProfileTypes } from '@/types/Profile';
import { ExperienceItem } from '@/types/Experience';
import { ProjectCard } from '@/types/Project';

function formatProfileMarkdown(profile: ProfileTypes): string {
  const lines = [
    `Name: ${profile.name}`,
    `Title: ${profile.label}`,
    profile.location
      ? `Location: ${[profile.location.city, profile.location.region, profile.location.country].filter(Boolean).join(', ')}`
      : null,
    `Email: ${profile.email}`,
    `Phone: ${profile.phone}`,
    `Portfolio: ${profile.url}`,
    ...profile.profiles.map((p) => `${p.network}: ${p.url}`),
    '',
    profile.summary,
  ].filter((line): line is string => line !== null);

  return lines.join('\n');
}

function formatExperiencesMarkdown(experiences: ExperienceItem[]): string {
  return experiences
    .map((exp) => {
      const dates = [exp.startDate, exp.isCurrent ? 'Present' : exp.endDate]
        .filter(Boolean)
        .join(' – ');
      const lines = [
        `### ${exp.position} — ${exp.company}${dates ? ` (${dates})` : ''}`,
        exp.summary,
        ...exp.highlights.map((h) => `- ${h}`),
      ].filter(Boolean);
      return lines.join('\n');
    })
    .join('\n\n');
}

function formatProjectsMarkdown(projects: ProjectCard[]): string {
  return projects
    .map((project) => {
      const meta = [
        project.role ? `Role: ${project.role}` : null,
        project.duration ? `Duration: ${project.duration}` : null,
        project.company ? `Company: ${project.company}` : null,
      ]
        .filter(Boolean)
        .join(' | ');
      const lines = [
        `### ${project.title}`,
        meta,
        project.description,
        project.skills.length > 0 ? `Skills: ${project.skills.join(', ')}` : null,
        project.liveLink && project.liveLink !== '/' ? `Live: ${project.liveLink}` : null,
      ].filter(Boolean);
      return lines.join('\n');
    })
    .join('\n\n');
}

export async function buildReferenceContent() {
  const [profile, experiences, projects] = await Promise.all([
    fetchProfile(),
    getVisibleExperiences(),
    getProjects(),
  ]);

  return {
    profileContent: formatProfileMarkdown(profile),
    experiencesContent: formatExperiencesMarkdown(experiences),
    projectsContent: formatProjectsMarkdown(projects),
  };
}
