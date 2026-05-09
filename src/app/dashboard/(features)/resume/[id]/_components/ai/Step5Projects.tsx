'use client';

import { cn } from '@/lib/cn';
import { ResumeData } from '../types';

interface Step5ProjectsProps {
  editableData: ResumeData;
  recommendedProjectIndices: number[];
  selectedProjectIndices: number[] | null;
  setSelectedProjectIndices: (v: number[] | null) => void;
}

export function Step5Projects({
  editableData,
  recommendedProjectIndices,
  selectedProjectIndices,
  setSelectedProjectIndices,
}: Step5ProjectsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Best projects for this job (select to show in preview)</p>
      <p className="text-xs text-muted-foreground">
        Recommended: {recommendedProjectIndices.length} projects. Toggle to include or exclude in
        resume preview.
      </p>
      <div className="max-h-60 overflow-y-auto border rounded-md p-2 space-y-1">
        {editableData.projects.map((project, idx) => {
          const selected =
            selectedProjectIndices !== null ? selectedProjectIndices.includes(idx) : true;
          const recommended = recommendedProjectIndices.includes(idx);
          return (
            <label
              key={idx}
              className={cn(
                'flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-muted/50 text-sm',
                selected && 'bg-muted/50'
              )}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => {
                  const current = selectedProjectIndices ?? editableData.projects.map((_, i) => i);
                  if (selected) {
                    setSelectedProjectIndices(current.filter(i => i !== idx));
                  } else {
                    setSelectedProjectIndices([...current, idx].sort((a, b) => a - b));
                  }
                }}
                className="rounded"
              />
              <span className="flex-1 truncate">{project.name}</span>
              {recommended && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">
                  Recommended
                </span>
              )}
            </label>
          );
        })}
      </div>
      {editableData.projects.length === 0 && (
        <p className="text-sm text-muted-foreground">Add projects first.</p>
      )}
    </div>
  );
}
