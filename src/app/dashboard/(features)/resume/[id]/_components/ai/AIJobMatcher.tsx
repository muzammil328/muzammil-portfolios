'use client';

import { Button, Card, CardContent, CardHeader, CardTitle } from '@muzammil328/ui';
import { Label, Textarea } from '@muzammil328/form';
import { Loader2, Search } from 'lucide-react';
import { Suggestion } from '@/components/SuggestionsList';
import SuggestionsList from '@/components/SuggestionsList';
import KeywordList from '@/components/KeywordList';

interface AIJobMatcherProps {
  jobDescription: string;
  setJobDescription: (v: string) => void;
  isAnalyzing: boolean;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  pendingAdditions: string[];
  onExtractKeywords: () => void;
  onGenerateSuggestions: () => void;
  onAddKeyword: (kw: string) => void;
  onRemoveKeyword: (kw: string) => void;
  onApplySuggestion: (s: Suggestion) => void;
  onDismissSuggestion: (s: Suggestion) => void;
}

export function AIJobMatcher({
  jobDescription,
  setJobDescription,
  isAnalyzing,
  matchedKeywords,
  missingKeywords,
  suggestions,
  pendingAdditions,
  onExtractKeywords,
  onGenerateSuggestions,
  onAddKeyword,
  onRemoveKeyword,
  onApplySuggestion,
  onDismissSuggestion,
}: AIJobMatcherProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          AI Job Matcher
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Paste Job Description</Label>
          <Textarea
            placeholder="Paste the job description here to get AI-powered keyword matching and suggestions..."
            className="min-h-30 text-sm"
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onExtractKeywords}
            disabled={!jobDescription.trim() || isAnalyzing}
            size="sm"
            className="gap-2"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Generate Keywords
          </Button>
          <Button
            onClick={onGenerateSuggestions}
            disabled={missingKeywords.length === 0 || isAnalyzing}
            size="sm"
            className="gap-2"
          >
            Get Suggestions
          </Button>
        </div>

        {isAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </div>
        )}

        {(matchedKeywords.length > 0 || missingKeywords.length > 0) && (
          <div className="border-t pt-4">
            <KeywordList
              matchedKeywords={matchedKeywords}
              missingKeywords={missingKeywords}
              onAddKeyword={onAddKeyword}
              onRemoveKeyword={onRemoveKeyword}
              pendingAdditions={pendingAdditions}
            />
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="border-t pt-4 space-y-3">
            <p className="text-sm font-medium">AI Suggestions</p>
            <SuggestionsList
              suggestions={suggestions}
              onApplySuggestion={onApplySuggestion}
              onDismissSuggestion={onDismissSuggestion}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
