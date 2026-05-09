'use client';

import { ResumeData } from '../types';
import { WorkPreview } from './WorkPreview';
import { EducationPreview } from './EducationPreview';
import { SkillsPreview } from './SkillsPreview';
import { ProjectsPreview } from './ProjectsPreview';

interface PreviewSectionRendererProps {
  section: string;
  data: ResumeData;
}

export function PreviewSectionRenderer({ section, data }: PreviewSectionRendererProps) {
  switch (section) {
    case 'work':
      return <WorkPreview work={data.work} />;
    case 'education':
      return <EducationPreview education={data.education} />;
    case 'skills':
      return <SkillsPreview skills={data.skills} />;
    case 'projects':
      return <ProjectsPreview projects={data.projects} />;
    default:
      return null;
  }
}
