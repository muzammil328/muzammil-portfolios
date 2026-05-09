'use client';

import { useState } from 'react';
import { toast } from '@muzammil328/ui';
import { Suggestion } from '@/components/SuggestionsList';
import {
  AnalysisFactor,
  SummarySuggestion,
  SkillsSuggestion,
  ExperienceSuggestion,
  ResumeData,
  ResumeBasics,
} from '../types';

interface UseAIAnalysisOptions {
  editableData: ResumeData;
  updateBasics: (field: keyof ResumeBasics, value: ResumeBasics[keyof ResumeBasics]) => void;
  updateItem: (section: keyof ResumeData, index: number, field: string, value: unknown) => void;
}

export function useAIAnalysis({ editableData, updateBasics, updateItem }: UseAIAnalysisOptions) {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [pendingAdditions, setPendingAdditions] = useState<string[]>([]);
  const [showKeywordPanel, setShowKeywordPanel] = useState(false);
  const [analysisFactors, setAnalysisFactors] = useState<AnalysisFactor[]>([]);
  const [summarySuggestion, setSummarySuggestion] = useState<SummarySuggestion | null>(null);
  const [skillsSuggestion, setSkillsSuggestion] = useState<SkillsSuggestion | null>(null);
  const [experienceSuggestions, setExperienceSuggestions] = useState<ExperienceSuggestion[]>([]);
  const [recommendedProjectIndices, setRecommendedProjectIndices] = useState<number[]>([]);
  const [aiPanelStep, setAiPanelStep] = useState(1);
  const [currentKeywords, setCurrentKeywords] = useState<{
    technicalSkills: string[];
    softSkills: string[];
    tools: string[];
    phrases: string[];
  } | null>(null);

  const extractKeywords = async () => {
    if (!jobDescription.trim()) return;
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      toast.error('OpenAI API key not configured. Add NEXT_PUBLIC_OPENAI_API_KEY to .env.local');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/extract-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      if (!res.ok) throw new Error('Failed to extract keywords');
      const data = await res.json();

      const allKeywords = [
        ...(data.technicalSkills || []),
        ...(data.softSkills || []),
        ...(data.tools || []),
        ...(data.phrases || []),
      ];
      const currentSkills = editableData.skills.flatMap(s => s.keywords).map(k => k.toLowerCase());
      const matched: string[] = [];
      const missing: string[] = [];
      for (const kw of allKeywords) {
        const found = currentSkills.some(
          cs => cs.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(cs)
        );
        if (found) matched.push(kw);
        else missing.push(kw);
      }
      setMatchedKeywords(matched);
      setMissingKeywords(missing);
      setCurrentKeywords(data);
      setShowKeywordPanel(true);
      setAiPanelStep(1);
    } catch (error) {
      console.error('Extract keywords error:', error);
      toast.error('Failed to extract keywords');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSuggestions = async () => {
    if (!currentKeywords) {
      toast.error('Please extract keywords first');
      return;
    }
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: editableData, keywords: currentKeywords }),
      });
      if (!res.ok) throw new Error('Failed to generate suggestions');
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setAiPanelStep(2);
    } catch (error) {
      console.error('Generate suggestions error:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddKeyword = (keyword: string) => {
    if (!pendingAdditions.includes(keyword)) {
      setPendingAdditions([...pendingAdditions, keyword]);
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setPendingAdditions(pendingAdditions.filter(k => k !== keyword));
  };

  const handleApplySuggestion = (suggestion: Suggestion) => {
    if (suggestion.section === 'work') {
      const workIndex = editableData.work.findIndex(
        (_, i) => suggestion.field === 'highlights' || i >= 0
      );
      if (workIndex >= 0 && suggestion.field === 'highlights') {
        const newHighlights = suggestion.suggestion.split('\n').filter(Boolean);
        updateItem('work', workIndex, 'highlights', newHighlights);
      }
    } else if (suggestion.section === 'summary' && suggestion.field === 'summary') {
      updateBasics('summary', suggestion.suggestion);
    } else if (suggestion.section === 'skills') {
      const newSkills = suggestion.suggestion.split(',').map(s => s.trim());
      const currentSkills = editableData.skills.flatMap(s => s.keywords);
      const addedSkills = newSkills.filter(skill => !currentSkills.includes(skill));
      if (addedSkills.length > 0) {
        updateItem('skills', 0, 'keywords', [...currentSkills, ...addedSkills]);
      }
    }
    setSuggestions(suggestions.filter(s => s !== suggestion));
    toast.success('Suggestion applied!');
  };

  const handleDismissSuggestion = (suggestion: Suggestion) => {
    setSuggestions(suggestions.filter(s => s !== suggestion));
  };

  return {
    jobDescription,
    setJobDescription,
    isAnalyzing,
    matchedKeywords,
    missingKeywords,
    suggestions,
    pendingAdditions,
    showKeywordPanel,
    setShowKeywordPanel,
    analysisFactors,
    setAnalysisFactors,
    summarySuggestion,
    setSummarySuggestion,
    skillsSuggestion,
    setSkillsSuggestion,
    experienceSuggestions,
    setExperienceSuggestions,
    recommendedProjectIndices,
    setRecommendedProjectIndices,
    aiPanelStep,
    setAiPanelStep,
    extractKeywords,
    generateSuggestions,
    handleAddKeyword,
    handleRemoveKeyword,
    handleApplySuggestion,
    handleDismissSuggestion,
  };
}
