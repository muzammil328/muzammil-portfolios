'use client';

import { ResumeSkill } from '../types';

interface SkillsPreviewProps {
  skills: ResumeSkill[];
}

export function SkillsPreview({ skills }: SkillsPreviewProps) {
  if (!skills?.length) return null;
  return (
    <section className="break-inside-avoid">
      <h3 className="text-lg font-bold text-black pb-0.5 mb-1.5 uppercase tracking-wider">
        Skills
      </h3>
      <div className="grid grid-cols-1 gap-y-2">
        {skills.map((skill, i) => (
          <div key={i} className="text-sm">
            <span className="font-bold text-black mr-2">{skill.name}:</span>
            <span className="text-black/85 leading-relaxed">{skill.keywords.join(', ')}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
