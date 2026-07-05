import React from 'react';
import { Button, CheckIcon, CloseIcon } from '@/components/ui';

export interface Suggestion {
  id?: string; // ✅ add unique id if possible
  section: string;
  field: string;
  suggestion: string;
  reason?: string;
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onApplySuggestion: (suggestion: Suggestion) => void; // ✅ cleaner
  onDismissSuggestion: (suggestion: Suggestion) => void; // ✅ cleaner
}

const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  onApplySuggestion,
  onDismissSuggestion,
}) => {
  // ✅ empty state
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-6">No suggestions available</div>
    );
  }

  return (
    <div className="space-y-3">
      {suggestions.map((s, i) => (
        <div
          key={s.id || `${s.section}-${i}`} // ✅ better key
          className="border rounded-lg p-3 space-y-2"
        >
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">AI Suggestion</p>

            <p className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
              {s.suggestion || 'No suggestion provided'}
            </p>
          </div>

          {s.reason && <p className="text-xs text-muted-foreground">{s.reason}</p>}

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-green-600 border-green-200"
              onClick={() => onApplySuggestion(s)}
            >
              <CheckIcon className="h-4 w-4 mr-1" />
              Apply
            </Button>

            <Button size="sm" variant="ghost" onClick={() => onDismissSuggestion(s)}>
              <CloseIcon className="h-4 w-4 mr-1" />
              Dismiss
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SuggestionsList;
