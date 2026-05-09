'use client';

import { CheckIcon, CloseIcon } from '@muzammil328/icon';
import { Button, toast } from '@muzammil328/ui';
import { SummarySuggestion } from '../types';

interface Step2SummaryProps {
  summarySuggestion: SummarySuggestion | null;
  setSummarySuggestion: (v: SummarySuggestion | null) => void;
  injectedSummary: string | null;
  setInjectedSummary: (v: string | null) => void;
}

export function Step2Summary({
  summarySuggestion,
  setSummarySuggestion,
  injectedSummary,
  setInjectedSummary,
}: Step2SummaryProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Professional summary (job-tailored)</p>
      {summarySuggestion ? (
        <div className="border rounded-lg p-3 space-y-3">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Current</p>
            <p className="text-sm bg-muted p-2 rounded">{summarySuggestion.original || '—'}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-green-600 mb-1">AI suggestion</p>
            <p className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
              {summarySuggestion.suggestion}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{summarySuggestion.reason}</p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200"
              onClick={() => {
                setInjectedSummary(summarySuggestion.suggestion);
                toast.success('Summary injected into preview');
              }}
            >
              <CheckIcon className="h-4 w-4 mr-1" /> Inject to preview
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSummarySuggestion(null)}>
    <CloseIcon className="h-4 w-4 mr-1" /> Dismiss
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          {injectedSummary
            ? 'Summary injected. Preview shows the new text.'
            : 'No summary suggestion for this job.'}
        </p>
      )}
    </div>
  );
}
