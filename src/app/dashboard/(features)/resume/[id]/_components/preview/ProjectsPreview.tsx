'use client';

import { ResumeProject } from '../types';

interface ProjectsPreviewProps {
  projects: ResumeProject[];
}

export function ProjectsPreview({ projects }: ProjectsPreviewProps) {
  if (!projects?.length) return null;
  return (
    <section className="break-inside-avoid">
      <h3 className="text-lg font-bold text-black pb-0.5 mb-1.5 uppercase tracking-wider">
        Projects
      </h3>
      <div className="space-y-5">
        {projects.map((project, i) => (
          <div key={i}>
            <div className="flex justify-between items-baseline mb-1">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold">{project.name}</h4>
                {(project.keywords || []).length > 0 && (
                  <span className="text-xs text-black/60">- {project.keywords.join(', ')}</span>
                )}
              </div>
              {project.url && (
                <a href={project.url} className="text-xs text-teal-700 hover:underline">
                  Link ↗
                </a>
              )}
            </div>
            {(project.highlights || []).length > 0 && (
              <ul className="list-none space-y-0.5 text-sm text-black/85 ml-0 mt-1">
                {project.highlights.map((h: string, hIdx: number) => (
                  <li key={hIdx} className="pl-3 relative">
                    <span className="absolute left-0 text-black/50">•</span>
                    <span className="ml-2">{h}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
