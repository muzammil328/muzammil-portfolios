'use client';

import { ResumeEducation } from '../types';

interface EducationPreviewProps {
  education: ResumeEducation[];
}

export function EducationPreview({ education }: EducationPreviewProps) {
  if (!education?.length) return null;
  return (
    <section className="break-inside-avoid">
      <h3 className="text-lg font-bold text-black pb-0.5 mb-1.5 uppercase tracking-wider">
        Education
      </h3>
      <div className="space-y-4">
        {education.map((edu, i) => (
          <div key={i} className="flex justify-between items-start">
            <div>
              <h4 className="text-base font-bold">{edu.institution}</h4>
              <p className="text-sm text-black/80">
                {edu.studyType} in {edu.area}
              </p>
            </div>
            <div className="text-right">
              <span className="block text-sm font-medium tabular-nums">
                {edu.startDate} — {edu.endDate}
              </span>
              {edu.score && <span className="block text-xs text-black/60">GPA: {edu.score}</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
