'use client';

import { ResumeData } from '../types';
import { WorkSection } from '../sections/WorkSection';
import { EducationSection } from '../sections/EducationSection';
import { SkillsSection } from '../sections/SkillsSection';
import { ProjectsSection } from '../sections/ProjectsSection';

interface EditorSectionRendererProps {
  section: string;
  editableData: ResumeData;
  activeWork: string | undefined;
  setActiveWork: (val: string | undefined) => void;
  activeEducation: string | undefined;
  setActiveEducation: (val: string | undefined) => void;
  activeSkills: string | undefined;
  setActiveSkills: (val: string | undefined) => void;
  activeProjects: string | undefined;
  setActiveProjects: (val: string | undefined) => void;
  addItem: (section: keyof ResumeData, item: unknown, setActive: (v: string) => void) => void;
  removeItem: (section: keyof ResumeData, index: number) => void;
  moveItem: (section: keyof ResumeData, index: number, direction: 'up' | 'down') => void;
  updateItem: (section: keyof ResumeData, index: number, field: string, value: unknown) => void;
}

export function EditorSectionRenderer({
  section,
  editableData,
  activeWork,
  setActiveWork,
  activeEducation,
  setActiveEducation,
  activeSkills,
  setActiveSkills,
  activeProjects,
  setActiveProjects,
  addItem,
  removeItem,
  moveItem,
  updateItem,
}: EditorSectionRendererProps) {
  const commonProps = { editableData, addItem, removeItem, moveItem, updateItem };

  switch (section) {
    case 'work':
      return <WorkSection {...commonProps} activeWork={activeWork} setActiveWork={setActiveWork} />;
    case 'education':
      return (
        <EducationSection
          {...commonProps}
          activeEducation={activeEducation}
          setActiveEducation={setActiveEducation}
        />
      );
    case 'skills':
      return (
        <SkillsSection
          {...commonProps}
          activeSkills={activeSkills}
          setActiveSkills={setActiveSkills}
        />
      );
    case 'projects':
      return (
        <ProjectsSection
          {...commonProps}
          activeProjects={activeProjects}
          setActiveProjects={setActiveProjects}
        />
      );
    default:
      return null;
  }
}
