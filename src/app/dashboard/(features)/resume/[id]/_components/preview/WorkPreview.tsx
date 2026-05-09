'use client';

import { ResumeWork } from '../types';

interface WorkPreviewProps {
  work: ResumeWork[];
}

export function WorkPreview({ work }: WorkPreviewProps) {
  if (!work?.length) return null;
  return (
    <section className="break-inside-avoid">
      <h3 className="text-lg font-bold text-black pb-0.5 mb-1.5 uppercase tracking-wider">
        Experience
      </h3>
      <div className="space-y-5">
        {work.map((job, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between items-baseline">
              <h4 className="text-base font-bold text-black">{job.name}</h4>
              <span className="text-sm font-medium text-black/70 tabular-nums">
                {job.startDate} — {job.endDate}
              </span>
            </div>
            <div className="text-sm font-semibold text-teal-700 italic">{job.position}</div>
            {job.highlights.length > 0 && (
              <ul className="list-none space-y-1 text-sm text-black/85 leading-relaxed ml-0 mt-1">
                {job.highlights.map((highlight, j) => (
                  <li key={j} className="pl-3 relative">
                    <span className="absolute left-0 text-black/60">•</span>
                    <span className="ml-2">{highlight}</span>
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
