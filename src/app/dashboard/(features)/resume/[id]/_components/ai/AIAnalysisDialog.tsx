'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@muzammil328/ui';
import {
  AnalysisFactor,
  ExperienceSuggestion,
  ResumeData,
  SkillsSuggestion,
  SummarySuggestion,
} from '../types';
import { Step1Factors } from './Step1Factors';
import { Step2Summary } from './Step2Summary';
import { Step3Skills } from './Step3Skills';
import { Step4Experience } from './Step4Experience';
import { Step5Projects } from './Step5Projects';

interface AIAnalysisDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  aiPanelStep: number;
  setAiPanelStep: (n: number) => void;
  analysisFactors: AnalysisFactor[];
  summarySuggestion: SummarySuggestion | null;
  setSummarySuggestion: (v: SummarySuggestion | null) => void;
  skillsSuggestion: SkillsSuggestion | null;
  setSkillsSuggestion: (v: SkillsSuggestion | null) => void;
  editableData: ResumeData;
  experienceSuggestions: ExperienceSuggestion[];
  injectedExperienceHighlights: Record<number, string[]>;
  setInjectedExperienceHighlights: (
    updater: (prev: Record<number, string[]>) => Record<number, string[]>
  ) => void;
  recommendedProjectIndices: number[];
  selectedProjectIndices: number[] | null;
  setSelectedProjectIndices: (v: number[] | null) => void;
  injectedSummary: string | null;
  setInjectedSummary: (v: string | null) => void;
  injectedSkills: string[] | null;
  setInjectedSkills: (v: string[] | null) => void;
  onDownloadPDF: () => void;
}

export function AIAnalysisDialog({
  open,
  onOpenChange,
  aiPanelStep,
  setAiPanelStep,
  analysisFactors,
  summarySuggestion,
  setSummarySuggestion,
  skillsSuggestion,
  setSkillsSuggestion,
  editableData,
  experienceSuggestions,
  injectedExperienceHighlights,
  setInjectedExperienceHighlights,
  recommendedProjectIndices,
  selectedProjectIndices,
  setSelectedProjectIndices,
  injectedSummary,
  setInjectedSummary,
  injectedSkills,
  setInjectedSkills,
  onDownloadPDF,
}: AIAnalysisDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>AI Job Match & Suggestions</DialogTitle>
          <DialogDescription>
            Step 1: Factors. Step 2–5: Tick to inject into preview (not saved). Download PDF when
            ready.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 border-b pb-2">
          {[1, 2, 3, 4, 5].map(step => (
            <Button
              key={step}
              variant={aiPanelStep === step ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setAiPanelStep(step)}
            >
              Step {step}
            </Button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 py-4 space-y-4">
          {aiPanelStep === 1 && <Step1Factors analysisFactors={analysisFactors} />}

          {aiPanelStep === 2 && (
            <Step2Summary
              summarySuggestion={summarySuggestion}
              setSummarySuggestion={setSummarySuggestion}
              injectedSummary={injectedSummary}
              setInjectedSummary={setInjectedSummary}
            />
          )}

          {aiPanelStep === 3 && (
            <Step3Skills
              skillsSuggestion={skillsSuggestion}
              setSkillsSuggestion={setSkillsSuggestion}
              injectedSkills={injectedSkills}
              setInjectedSkills={setInjectedSkills}
            />
          )}

          {aiPanelStep === 4 && (
            <Step4Experience
              editableData={editableData}
              experienceSuggestions={experienceSuggestions}
              injectedExperienceHighlights={injectedExperienceHighlights}
              setInjectedExperienceHighlights={setInjectedExperienceHighlights}
            />
          )}

          {aiPanelStep === 5 && (
            <Step5Projects
              editableData={editableData}
              recommendedProjectIndices={recommendedProjectIndices}
              selectedProjectIndices={selectedProjectIndices}
              setSelectedProjectIndices={setSelectedProjectIndices}
            />
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onDownloadPDF}>Download PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
