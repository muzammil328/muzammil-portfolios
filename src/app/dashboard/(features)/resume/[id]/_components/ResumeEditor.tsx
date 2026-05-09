'use client';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Loader2 } from 'lucide-react';
import { Button } from '@muzammil328/ui';
import Link from 'next/link';
import { ArrowLeft, Download, Eye, EyeOff, RotateCcw, Save } from 'lucide-react';

import { useResumeData } from './hooks/useResumeData';
import { useAIAnalysis } from './hooks/useAIAnalysis';
import { PersonalDetailsForm } from './forms/PersonalDetailsForm';
import { ProfileLinksForm } from './forms/ProfileLinksForm';
import { EditorSectionRenderer } from './preview/EditorSectionRenderer';
import { ResumePreview } from './preview/ResumePreview';
import { AIJobMatcher } from './ai/AIJobMatcher';
import { AIAnalysisDialog } from './ai/AIAnalysisDialog';
import { EditorLayout } from './layout/EditorLayout';

export function ResumeEditor() {
  const resume = useResumeData();
  const ai = useAIAnalysis({
    editableData: resume.editableData,
    updateBasics: resume.updateBasics,
    updateItem: resume.updateItem,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      resume.setSectionOrder(items => {
        const oldIndex = items.findIndex(i => i === active.id);
        const newIndex = items.findIndex(i => i === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  if (resume.hasFeatureAccess === null) return null;

  if (resume.hasFeatureAccess === false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  if (resume.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const editorLeft = (
    <>
      <PersonalDetailsForm
        editableData={resume.editableData}
        updateBasics={resume.updateBasics}
        updateLocation={resume.updateLocation}
      />
      <ProfileLinksForm
        editableData={resume.editableData}
        updateBasics={resume.updateBasics}
        updateProfile={resume.updateProfile}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={resume.sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-6">
            {resume.sectionOrder.map(section => (
              <EditorSectionRenderer
                key={section}
                section={section}
                editableData={resume.editableData}
                activeWork={resume.activeWork}
                setActiveWork={resume.setActiveWork}
                activeEducation={resume.activeEducation}
                setActiveEducation={resume.setActiveEducation}
                activeSkills={resume.activeSkills}
                setActiveSkills={resume.setActiveSkills}
                activeProjects={resume.activeProjects}
                setActiveProjects={resume.setActiveProjects}
                addItem={resume.addItem}
                removeItem={resume.removeItem}
                moveItem={resume.moveItem}
                updateItem={resume.updateItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AIJobMatcher
        jobDescription={ai.jobDescription}
        setJobDescription={ai.setJobDescription}
        isAnalyzing={ai.isAnalyzing}
        matchedKeywords={ai.matchedKeywords}
        missingKeywords={ai.missingKeywords}
        suggestions={ai.suggestions}
        pendingAdditions={ai.pendingAdditions}
        onExtractKeywords={ai.extractKeywords}
        onGenerateSuggestions={ai.generateSuggestions}
        onAddKeyword={ai.handleAddKeyword}
        onRemoveKeyword={ai.handleRemoveKeyword}
        onApplySuggestion={ai.handleApplySuggestion}
        onDismissSuggestion={ai.handleDismissSuggestion}
      />
    </>
  );

  const editorRight = (
    <ResumePreview
      printRef={resume.printRef}
      displayData={resume.displayData}
      sectionOrder={resume.sectionOrder}
      isPreviewMode={resume.isPreviewMode}
    />
  );

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link
              href="/career/resume"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight hidden md:block">Resume Editor</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resume.handleReset}
              className="hidden md:flex gap-2"
              disabled={resume.isSaving}
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              variant={resume.isPreviewMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => resume.setIsPreviewMode(!resume.isPreviewMode)}
              className="gap-2"
            >
              {resume.isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{resume.isPreviewMode ? 'Edit' : 'Preview'}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resume.handleSave}
              disabled={resume.isSaving}
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </Button>
            <Button
              size="sm"
              className="gap-2 shadow-sm"
              onClick={() => {
                if (
                  ai.jobDescription.trim() &&
                  (ai.matchedKeywords.length > 0 || ai.missingKeywords.length > 0)
                ) {
                  ai.setShowKeywordPanel(true);
                } else {
                  resume.handlePrint();
                }
              }}
            >
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <EditorLayout isPreviewMode={resume.isPreviewMode} left={editorLeft} right={editorRight} />

      <AIAnalysisDialog
        open={ai.showKeywordPanel}
        onOpenChange={ai.setShowKeywordPanel}
        aiPanelStep={ai.aiPanelStep}
        setAiPanelStep={ai.setAiPanelStep}
        analysisFactors={ai.analysisFactors}
        summarySuggestion={ai.summarySuggestion}
        setSummarySuggestion={ai.setSummarySuggestion}
        skillsSuggestion={ai.skillsSuggestion}
        setSkillsSuggestion={ai.setSkillsSuggestion}
        editableData={resume.editableData}
        experienceSuggestions={ai.experienceSuggestions}
        injectedExperienceHighlights={resume.injectedExperienceHighlights}
        setInjectedExperienceHighlights={resume.setInjectedExperienceHighlights}
        recommendedProjectIndices={ai.recommendedProjectIndices}
        selectedProjectIndices={resume.selectedProjectIndices}
        setSelectedProjectIndices={resume.setSelectedProjectIndices}
        injectedSummary={resume.injectedSummary}
        setInjectedSummary={resume.setInjectedSummary}
        injectedSkills={resume.injectedSkills}
        setInjectedSkills={resume.setInjectedSkills}
        onDownloadPDF={() => {
          ai.setShowKeywordPanel(false);
          resume.handlePrint();
        }}
      />
    </div>
  );
}
