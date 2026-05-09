'use client';

import { CheckIcon } from '@muzammil328/icon';
import { Button, toast } from '@muzammil328/ui';
import { ExperienceSuggestion, ResumeData } from '../types';

interface Step4ExperienceProps {
  editableData: ResumeData;
  experienceSuggestions: ExperienceSuggestion[];
  injectedExperienceHighlights: Record<number, string[]>;
  setInjectedExperienceHighlights: (
    updater: (prev: Record<number, string[]>) => Record<number, string[]>
  ) => void;
}

export function Step4Experience({
  editableData,
  experienceSuggestions,
  injectedExperienceHighlights,
  setInjectedExperienceHighlights,
}: Step4ExperienceProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Experience keyword suggestions</p>
      {editableData.work.map((job, workIndex) => {
        const sugg = experienceSuggestions.find(s => s.workIndex === workIndex);
        const injected = injectedExperienceHighlights[workIndex] || [];
        const keywords = sugg?.keywords || [];
        return (
          <div key={workIndex} className="border rounded-lg p-3 space-y-2">
            <p className="font-medium text-sm">
              {job.name} – {job.position}
            </p>
            {keywords.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {keywords.map(kw => {
                  const added = injected.includes(kw);
                  return (
                    <Button
                      key={kw}
                      size="sm"
                      variant={added ? 'default' : 'outline'}
                      className="h-7 text-xs"
                      onClick={() => {
                        setInjectedExperienceHighlights(prev => ({
                          ...prev,
                          [workIndex]: added
                            ? (prev[workIndex] || []).filter(k => k !== kw)
                            : [...(prev[workIndex] || []), kw],
                        }));
                        if (!added) toast.success(`Added "${kw}" to preview`);
                      }}
                    >
                      {added ? <CheckIcon className="h-3 w-3 mr-1" /> : null}
                      {kw}
                    </Button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No keywords suggested for this role.</p>
            )}
          </div>
        );
      })}
      {editableData.work.length === 0 && (
        <p className="text-sm text-muted-foreground">Add experience entries first.</p>
      )}
    </div>
  );
}
