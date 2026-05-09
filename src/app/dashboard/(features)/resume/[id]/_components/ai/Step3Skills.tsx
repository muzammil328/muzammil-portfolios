'use client';

import { CheckIcon, CloseIcon } from '@muzammil328/icon';
import { Button, toast } from '@muzammil328/ui';
import { SkillsSuggestion } from '../types';

interface Step3SkillsProps {
  skillsSuggestion: SkillsSuggestion | null;
  setSkillsSuggestion: (v: SkillsSuggestion | null) => void;
  injectedSkills: string[] | null;
  setInjectedSkills: (v: string[] | null) => void;
}

export function Step3Skills({
  skillsSuggestion,
  setSkillsSuggestion,
  injectedSkills,
  setInjectedSkills,
}: Step3SkillsProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Skills suggestion</p>
      {skillsSuggestion ? (
        <div className="border rounded-lg p-3 space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Current</p>
            <p className="text-sm bg-muted p-2 rounded">{skillsSuggestion.original || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-green-600 mb-1">AI suggestion (add these)</p>
            <p className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
              {skillsSuggestion.suggestion}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{skillsSuggestion.reason}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200"
              onClick={() => {
                const added = skillsSuggestion.suggestion
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean);
                setInjectedSkills(added);
                toast.success('Skills injected into preview');
              }}
            >
              <CheckIcon className="h-4 w-4 mr-1" /> Inject to preview
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSkillsSuggestion(null)}>
              <CloseIcon className="h-4 w-4 mr-1" /> Dismiss
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {injectedSkills?.length
            ? 'Skills injected. Preview updated.'
            : 'No skills suggestion for this job.'}
        </p>
      )}
    </div>
  );
}
