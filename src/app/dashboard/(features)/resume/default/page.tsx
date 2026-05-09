'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Loader2,
  Sparkles,
  X,
  Plus,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  MapPin,
  Clock,
  Briefcase,
  Calendar,
  Building2,
} from 'lucide-react';
import { Button, toast } from '@muzammil328/ui';
import { Label, Textarea } from '@muzammil328/form';
import SuggestionsList, { Suggestion } from '@/components/SuggestionsList';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WorkProject {
  name: string;
  url: string;
  techStack: string[];
  highlights: string[];
}

interface ResumeData {
  basics: {
    name: string;
    label: string;
    email: string;
    phone: string;
    url: string;
    summary: string;
    location: {
      address: string;
      postalCode: string;
      city: string;
      countryCode: string;
      region: string;
    };
    profiles: { network: string; username: string; url: string }[];
  };
  work: {
    name: string;
    position: string;
    url: string;
    startDate: string;
    endDate: string;
    summary: string;
    highlights: string[];
    projects: WorkProject[];
  }[];
  education: {
    institution: string;
    url: string;
    area: string;
    studyType: string;
    startDate: string;
    endDate: string;
    score: string;
    courses: string[];
  }[];
  skills: { name: string; keywords: string[] }[];
  personalProjects: {
    name: string;
    url: string;
    techStack: string[];
    highlights: string[];
  }[];
}

interface ParsedJob {
  company: string | null;
  jobTitle: string | null;
  location: string | null;
  experienceRequired: string | null;
  experienceYearsMin: number;
  experienceYearsMax: number;
  jobType: string | null;
  workingHours: string | null;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  responsibilities: string[];
  requirements: string[];
}

interface MatchResult {
  category: 'skill' | 'experience' | 'niceskill';
  item: string;
  matched: boolean;
  detail: string;
}

interface ExtractedKeywords {
  technicalSkills: string[];
  softSkills: string[];
  tools: string[];
  phrases: string[];
}

const SKILL_CATEGORY_LABELS: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  devops: 'DevOps',
  cloud: 'Cloud & Hosting',
  tools: 'Tools',
  other: 'Other',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  if (!dateStr || dateStr === 'Present') return dateStr;
  const [year, month] = dateStr.split('-');
  if (!month) return year;
  const monthName = new Date(Number(year), Number(month) - 1).toLocaleString('en-US', {
    month: 'short',
  });
  return `${monthName} ${year}`;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

function countFrequency(keyword: string, text: string): number {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = text.match(new RegExp(escaped, 'gi'));
  return matches ? matches.length : 1;
}

function computeExperienceYears(work: ResumeData['work']): number {
  let totalMonths = 0;
  for (const job of work) {
    const start = job.startDate ? new Date(job.startDate) : null;
    const end = !job.endDate || job.endDate === 'Present' ? new Date() : new Date(job.endDate);
    if (start) {
      totalMonths +=
        (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    }
  }
  return Math.max(0, Math.round(totalMonths / 12));
}

function buildMatchResults(parsedJob: ParsedJob, resume: ResumeData): MatchResult[] {
  const results: MatchResult[] = [];
  const allSkills = resume.skills.flatMap(s => s.keywords).map(k => k.toLowerCase());

  const skillMatch = (skill: string) =>
    allSkills.some(s => s.includes(skill.toLowerCase()) || skill.toLowerCase().includes(s));

  // Required skills
  for (const skill of parsedJob.requiredSkills) {
    const found = skillMatch(skill);
    results.push({
      category: 'skill',
      item: skill,
      matched: found,
      detail: found ? 'Found in your skills' : 'Not found in your profile',
    });
  }

  // Experience
  const myYears = computeExperienceYears(resume.work);
  const minReq = parsedJob.experienceYearsMin || 0;
  if (parsedJob.experienceRequired) {
    const meets = myYears >= minReq;
    results.push({
      category: 'experience',
      item: `${parsedJob.experienceRequired} experience`,
      matched: meets,
      detail: meets
        ? `You have ~${myYears} year${myYears !== 1 ? 's' : ''} of experience`
        : `Required: ${parsedJob.experienceRequired} · You have: ~${myYears} yr${myYears !== 1 ? 's' : ''}`,
    });
  }

  // Nice-to-have
  for (const skill of parsedJob.niceToHaveSkills ?? []) {
    const found = skillMatch(skill);
    results.push({
      category: 'niceskill',
      item: skill,
      matched: found,
      detail: found ? 'Found in your profile (bonus!)' : 'Not in profile (optional)',
    });
  }

  return results;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="mb-2">
      <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{title}</h2>
      <div className="border-b border-gray-800 mt-0.5" />
    </div>
  );
}

function ATSScoreRing({
  score,
  matched,
  total,
}: {
  score: number;
  matched: number;
  total: number;
}) {
  const circumference = 2 * Math.PI * 40;
  const dash = (score / 100) * circumference;
  const color = score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626';
  const label = score >= 70 ? 'Great match!' : score >= 40 ? 'Needs improvement' : 'Low match';

  return (
    <div className="flex flex-col items-center py-4 border-b">
      <svg width="110" height="110" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text
          x="50"
          y="47"
          textAnchor="middle"
          fontSize="20"
          fontWeight="bold"
          fill={color}
          fontFamily="Arial, sans-serif"
        >
          {score}%
        </text>
        <text
          x="50"
          y="61"
          textAnchor="middle"
          fontSize="8"
          fill="#6b7280"
          fontFamily="Arial, sans-serif"
        >
          ATS Score
        </text>
      </svg>
      <p className="text-xs font-semibold mt-1" style={{ color }}>
        {label}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {matched} / {total} keywords matched
      </p>
    </div>
  );
}

function WordCloud({
  keywords,
  frequencies,
  isMatched,
  onAdd,
}: {
  keywords: string[];
  frequencies: Record<string, number>;
  isMatched: boolean;
  onAdd?: (kw: string) => void;
}) {
  const [hoveredKw, setHoveredKw] = useState<string | null>(null);
  if (keywords.length === 0) return null;

  const freqValues = keywords.map(k => frequencies[k] ?? 1);
  const minF = Math.min(...freqValues);
  const maxF = Math.max(...freqValues);
  const scale = (f: number) => (maxF === minF ? 13 : 11 + ((f - minF) / (maxF - minF)) * 8);

  return (
    <div className="flex flex-wrap gap-1.5 py-1">
      {keywords.map(kw => {
        const freq = frequencies[kw] ?? 1;
        const fontSize = scale(freq);
        return (
          <div key={kw} className="relative">
            <button
              style={{ fontSize: `${fontSize}px`, lineHeight: 1.4 }}
              className={
                isMatched
                  ? 'px-2 py-0.5 rounded-full font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 cursor-default'
                  : 'px-2 py-0.5 rounded-full font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-200 transition-colors flex items-center gap-1'
              }
              onClick={() => !isMatched && onAdd?.(kw)}
              onMouseEnter={() => setHoveredKw(kw)}
              onMouseLeave={() => setHoveredKw(null)}
            >
              {!isMatched && <Plus style={{ width: fontSize - 2, height: fontSize - 2 }} />}
              {kw}
            </button>
            {hoveredKw === kw && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 pointer-events-none">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap shadow-lg">
                  {isMatched ? '✓ In resume' : '+ Add to skills'} · {freq}× in job desc
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DefaultResumePage() {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [displayData, setDisplayData] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModified, setIsModified] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  // AI panel
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Step 1: parsed job
  const [parsedJob, setParsedJob] = useState<ParsedJob | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(true);

  // Step 2: profile match
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [showMatchDetails, setShowMatchDetails] = useState(true);

  // Step 3: keywords & ATS
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [keywordFrequencies, setKeywordFrequencies] = useState<Record<string, number>>({});
  const [currentKeywords, setCurrentKeywords] = useState<ExtractedKeywords | null>(null);
  const [showKeywordCloud, setShowKeywordCloud] = useState(true);

  // Step 4: suggestions
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const totalKw = matchedKeywords.length + missingKeywords.length;
  const atsScore = totalKw > 0 ? Math.round((matchedKeywords.length / totalKw) * 100) : 0;

  const requiredMatched = matchResults.filter(r => r.category !== 'niceskill' && r.matched).length;
  const requiredTotal = matchResults.filter(r => r.category !== 'niceskill').length;

  useEffect(() => {
    fetch('/api/resume/default')
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) {
          setResumeData(data);
          setDisplayData(deepClone(data));
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const recomputeKeywords = useCallback((data: ResumeData, kws: ExtractedKeywords) => {
    const all = [
      ...(kws.technicalSkills || []),
      ...(kws.softSkills || []),
      ...(kws.tools || []),
      ...(kws.phrases || []),
    ];
    const resume = data.skills.flatMap(s => s.keywords).map(k => k.toLowerCase());
    const matched: string[] = [];
    const missing: string[] = [];
    for (const kw of all) {
      const found = resume.some(s => s.includes(kw.toLowerCase()) || kw.toLowerCase().includes(s));
      if (found) matched.push(kw);
      else missing.push(kw);
    }
    setMatchedKeywords(matched);
    setMissingKeywords(missing);
  }, []);

  const handleReset = useCallback(() => {
    if (resumeData) {
      setDisplayData(deepClone(resumeData));
      setIsModified(false);
      setParsedJob(null);
      setMatchResults([]);
      setMatchedKeywords([]);
      setMissingKeywords([]);
      setKeywordFrequencies({});
      setCurrentKeywords(null);
      setSuggestions([]);
      setJobDescription('');
      toast.success('Reset to original resume data');
    }
  }, [resumeData]);

  // ── Step 1: Parse job description ─────────────────────────────────────────
  const analyzeJob = async () => {
    if (!jobDescription.trim() || !displayData) return;
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (!apiKey) {
      toast.error('OpenAI API key not configured');
      return;
    }

    setIsParsing(true);
    try {
      // Parse structured job info
      const parseRes = await fetch('/api/ai/parse-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      if (!parseRes.ok) throw new Error();
      const job: ParsedJob = await parseRes.json();
      setParsedJob(job);
      setShowJobDetails(true);

      // Compute profile match client-side immediately
      const matches = buildMatchResults(job, displayData);
      setMatchResults(matches);
      setShowMatchDetails(true);

      // Extract keywords simultaneously
      const kwRes = await fetch('/api/ai/extract-keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription }),
      });
      if (!kwRes.ok) throw new Error();
      const kwData: ExtractedKeywords = await kwRes.json();

      const all = [
        ...(kwData.technicalSkills || []),
        ...(kwData.softSkills || []),
        ...(kwData.tools || []),
        ...(kwData.phrases || []),
      ];
      const freq: Record<string, number> = {};
      for (const kw of all) freq[kw] = countFrequency(kw, jobDescription);

      setKeywordFrequencies(freq);
      setCurrentKeywords(kwData);
      recomputeKeywords(displayData, kwData);
      setShowKeywordCloud(true);
      setSuggestions([]);
      setShowSuggestions(false);
    } catch {
      toast.error('Failed to analyze job description');
    } finally {
      setIsParsing(false);
    }
  };

  // ── Step 4: Generate suggestions ─────────────────────────────────────────
  const generateSuggestions = async () => {
    if (!currentKeywords || !displayData) return;
    setIsAnalyzing(true);
    try {
      const payload = {
        basics: displayData.basics,
        work: displayData.work,
        skills: displayData.skills,
        projects: displayData.personalProjects.map(p => ({
          name: p.name,
          keywords: p.techStack,
          highlights: p.highlights,
        })),
        education: displayData.education,
      };
      const res = await fetch('/api/ai/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData: payload, keywords: currentKeywords }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      const normalized: Suggestion[] = (data.suggestions || []).map(
        (s: { section: string; field: string; suggested: string; reason?: string }) => ({
          section: s.section,
          field: s.field,
          suggestion: s.suggested,
          reason: s.reason,
        })
      );
      setSuggestions(normalized);
      setShowSuggestions(true);
    } catch {
      toast.error('Failed to generate suggestions');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addKeywordToSkills = useCallback(
    (keyword: string) => {
      if (!displayData) return;
      const updated = deepClone(displayData);
      if (updated.skills.length > 0) {
        updated.skills[updated.skills.length - 1].keywords.push(keyword);
      } else {
        updated.skills.push({ name: 'other', keywords: [keyword] });
      }
      setDisplayData(updated);
      setIsModified(true);
      if (currentKeywords) recomputeKeywords(updated, currentKeywords);
      // Also update match results
      if (parsedJob) setMatchResults(buildMatchResults(parsedJob, updated));
      toast.success(`"${keyword}" added to skills`);
    },
    [displayData, currentKeywords, parsedJob, recomputeKeywords]
  );

  const applySuggestion = useCallback(
    (s: Suggestion) => {
      if (!displayData) return;
      const updated = deepClone(displayData);
      if (s.section === 'summary' && s.field === 'summary') {
        updated.basics.summary = s.suggestion;
      } else if (s.section === 'skills' && s.field === 'keywords') {
        const toAdd = s.suggestion
          .split(/[,\n]/)
          .map(k => k.trim())
          .filter(Boolean);
        const existing = updated.skills.flatMap(sk => sk.keywords.map(k => k.toLowerCase()));
        const newOnes = toAdd.filter(k => !existing.includes(k.toLowerCase()));
        if (updated.skills.length > 0) {
          updated.skills[updated.skills.length - 1].keywords.push(...newOnes);
        }
      } else if (s.section === 'work' && s.field === 'highlights') {
        const lines = s.suggestion.split('\n').filter(Boolean);
        if (updated.work.length > 0) updated.work[0].highlights = lines;
      } else if (s.section === 'projects' && s.field === 'highlights') {
        const lines = s.suggestion.split('\n').filter(Boolean);
        if (updated.personalProjects.length > 0) updated.personalProjects[0].highlights = lines;
      }
      setDisplayData(updated);
      setIsModified(true);
      if (currentKeywords) recomputeKeywords(updated, currentKeywords);
      if (parsedJob) setMatchResults(buildMatchResults(parsedJob, updated));
      setSuggestions(prev => prev.filter(x => x !== s));
      toast.success('Applied to resume preview');
    },
    [displayData, currentKeywords, parsedJob, recomputeKeywords]
  );

  const dismissSuggestion = useCallback(
    (s: Suggestion) => setSuggestions(prev => prev.filter(x => x !== s)),
    []
  );

  // ─── Render ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!displayData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">No Default Resume Found</h2>
        <p className="text-muted-foreground mb-4">Your default resume could not be loaded.</p>
        <Link href="/dashboard/resume">
          <Button>Back to Resumes</Button>
        </Link>
      </div>
    );
  }

  const { basics, work, education, skills, personalProjects } = displayData;

  const contactItems: React.ReactNode[] = [
    basics.phone && <span key="phone">{basics.phone}</span>,
    (basics.location?.city || basics.location?.region) && (
      <span key="location">
        {[basics.location.city, basics.location.region].filter(Boolean).join(', ')}
      </span>
    ),
    basics.email && <span key="email">{basics.email}</span>,
    basics.url && (
      <a
        key="portfolio"
        href={basics.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#0d9488', textDecoration: 'underline' }}
      >
        Portfolio
      </a>
    ),
    ...(basics.profiles || [])
      .filter(p => p.url)
      .map((p, i) => (
        <a
          key={`p-${i}`}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#0d9488', textDecoration: 'underline' }}
        >
          {p.network}
        </a>
      )),
  ].filter(Boolean) as React.ReactNode[];

  return (
    <div className="min-h-screen bg-background">
      {/* Toolbar */}
      <div className="border-b bg-muted/30 print:hidden">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/resume">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Default Resume</h1>
              <p className="text-sm text-muted-foreground">
                {isModified ? (
                  <span className="text-amber-600 font-medium">
                    AI-modified preview — not saved
                  </span>
                ) : (
                  'Generated from your Sanity portfolio data'
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isModified && (
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            )}
            <Button
              variant={isAIOpen ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAIOpen(v => !v)}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Analyze
              {totalKw > 0 && (
                <span
                  className="ml-1 text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: atsScore >= 70 ? '#dcfce7' : atsScore >= 40 ? '#fef9c3' : '#fee2e2',
                    color: atsScore >= 70 ? '#16a34a' : atsScore >= 40 ? '#d97706' : '#dc2626',
                  }}
                >
                  {atsScore}%
                </span>
              )}
            </Button>
            <Button onClick={() => window.print()} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 0; size: A4; }
          body { margin: 0; }
          .ai-panel { display: none !important; }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 print:p-0 print:max-w-none">
        <div className={`flex gap-6 items-start ${isAIOpen ? 'flex-row' : 'flex-col'}`}>
          {/* ── Resume Document ─────────────────────────────────────────── */}
          <div
            ref={printRef}
            className="bg-white shadow-lg print:shadow-none shrink-0"
            style={{
              fontFamily: '"Arial", "Helvetica Neue", Helvetica, sans-serif',
              width: '210mm',
              minHeight: '297mm',
              padding: '10mm 14mm',
              fontSize: '10pt',
              color: '#111',
              ...(isAIOpen ? {} : { margin: '0 auto' }),
            }}
          >
            <header style={{ marginBottom: '12px' }}>
              <h1
                style={{
                  fontSize: '26pt',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  color: '#111',
                  marginBottom: '2px',
                }}
              >
                {basics.name || 'Your Name'}
              </h1>
              <p
                style={{ fontSize: '13pt', fontWeight: 700, color: '#0d9488', marginBottom: '6px' }}
              >
                {basics.label || 'Job Title'}
              </p>
              <div
                style={{
                  fontSize: '9pt',
                  color: '#333',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: 0,
                }}
              >
                {contactItems.reduce<React.ReactNode[]>((acc, el, i) => {
                  if (i > 0)
                    acc.push(
                      <span key={`sep-${i}`} style={{ margin: '0 6px', color: '#888' }}>
                        |
                      </span>
                    );
                  acc.push(el);
                  return acc;
                }, [])}
              </div>
            </header>

            {basics.summary && (
              <section style={{ marginBottom: '12px' }}>
                <SectionHeading title="Summary" />
                <p style={{ fontSize: '9pt', lineHeight: 1.6, textAlign: 'justify' }}>
                  {basics.summary}
                </p>
              </section>
            )}

            {skills?.length > 0 && (
              <section style={{ marginBottom: '12px' }}>
                <SectionHeading title="Skills" />
                <ul style={{ margin: 0, paddingLeft: '14px', listStyleType: 'disc' }}>
                  {skills.map((skill, i) => (
                    <li key={i} style={{ fontSize: '9pt', lineHeight: 1.6 }}>
                      <strong>{SKILL_CATEGORY_LABELS[skill.name] || skill.name}:</strong>{' '}
                      {skill.keywords?.join(', ')}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {work?.length > 0 && (
              <section style={{ marginBottom: '12px' }}>
                <SectionHeading title="Professional Experience" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {work.map((job, i) => (
                    <div key={i}>
                      <p
                        style={{
                          fontSize: '10pt',
                          fontWeight: 700,
                          color: '#0d9488',
                          marginBottom: '1px',
                        }}
                      >
                        {job.url ? (
                          <a
                            href={job.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'none' }}
                          >
                            {job.name}
                          </a>
                        ) : (
                          job.name
                        )}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                        }}
                      >
                        <p style={{ fontSize: '9.5pt', fontWeight: 700, color: '#111' }}>
                          {job.position}
                        </p>
                        {(job.startDate || job.endDate) && (
                          <span
                            style={{
                              fontSize: '9pt',
                              color: '#444',
                              whiteSpace: 'nowrap',
                              marginLeft: '8px',
                            }}
                          >
                            {formatDate(job.startDate)}
                            {job.endDate && ` - ${formatDate(job.endDate)}`}
                          </span>
                        )}
                      </div>
                      {job.highlights?.length > 0 && (
                        <ul
                          style={{ margin: '3px 0 0', paddingLeft: '14px', listStyleType: 'disc' }}
                        >
                          {job.highlights.map((h, j) => (
                            <li key={j} style={{ fontSize: '9pt', lineHeight: 1.5 }}>
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                      {job.projects?.length > 0 && (
                        <div
                          style={{
                            marginTop: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                          }}
                        >
                          {job.projects.map((proj, j) => (
                            <div key={j}>
                              <p style={{ fontSize: '9.5pt', fontWeight: 600, color: '#0d9488' }}>
                                {proj.url ? (
                                  <a
                                    href={proj.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: 'inherit', textDecoration: 'none' }}
                                  >
                                    {proj.name}
                                  </a>
                                ) : (
                                  proj.name
                                )}
                              </p>
                              {proj.techStack?.length > 0 && (
                                <p style={{ fontSize: '9pt', color: '#444', margin: '1px 0' }}>
                                  <strong>Tech Stack:</strong> {proj.techStack.join(', ')}
                                </p>
                              )}
                              {proj.highlights?.length > 0 && (
                                <ul
                                  style={{
                                    margin: '2px 0 0',
                                    paddingLeft: '14px',
                                    listStyleType: 'disc',
                                  }}
                                >
                                  {proj.highlights.map((h, k) => (
                                    <li key={k} style={{ fontSize: '9pt', lineHeight: 1.5 }}>
                                      {h}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {personalProjects?.length > 0 && (
              <section style={{ marginBottom: '12px' }}>
                <SectionHeading title="Personal Projects" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {personalProjects.map((proj, i) => (
                    <div key={i}>
                      <p style={{ fontSize: '9.5pt', fontWeight: 600, color: '#0d9488' }}>
                        {proj.url ? (
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'inherit', textDecoration: 'underline' }}
                          >
                            {proj.name}
                          </a>
                        ) : (
                          proj.name
                        )}
                      </p>
                      {proj.techStack?.length > 0 && (
                        <p style={{ fontSize: '9pt', color: '#444', margin: '1px 0' }}>
                          <strong>Tech Stack:</strong> {proj.techStack.join(', ')}
                        </p>
                      )}
                      {proj.highlights?.length > 0 && (
                        <ul
                          style={{ margin: '2px 0 0', paddingLeft: '14px', listStyleType: 'disc' }}
                        >
                          {proj.highlights.map((h, j) => (
                            <li key={j} style={{ fontSize: '9pt', lineHeight: 1.5 }}>
                              {h}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {education?.length > 0 && (
              <section style={{ marginBottom: '12px' }}>
                <SectionHeading title="Education" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {education.map((edu, i) => (
                    <div key={i}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                        }}
                      >
                        <p style={{ fontSize: '9.5pt', fontWeight: 700, color: '#111' }}>
                          {edu.studyType}
                          {edu.area ? ` of ${edu.area}` : ''}
                        </p>
                        {(edu.startDate || edu.endDate) && (
                          <span
                            style={{
                              fontSize: '9pt',
                              color: '#444',
                              whiteSpace: 'nowrap',
                              marginLeft: '8px',
                            }}
                          >
                            {formatDate(edu.startDate)}
                            {edu.endDate && ` - ${formatDate(edu.endDate)}`}
                          </span>
                        )}
                      </div>
                      {edu.institution && (
                        <p style={{ fontSize: '9pt', color: '#444' }}>{edu.institution}</p>
                      )}
                      {edu.score && (
                        <p style={{ fontSize: '9pt', color: '#666' }}>Score: {edu.score}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── AI Analysis Panel ────────────────────────────────────────── */}
          {isAIOpen && (
            <div
              className="ai-panel shrink-0 sticky top-4 space-y-3"
              style={{ width: '370px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
            >
              {/* ATS Score (shown after keyword extraction) */}
              {totalKw > 0 && (
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                  <ATSScoreRing score={atsScore} matched={matchedKeywords.length} total={totalKw} />
                  {requiredTotal > 0 && (
                    <div className="px-4 py-2 text-center text-xs text-muted-foreground">
                      Profile requirements: {requiredMatched}/{requiredTotal} met
                    </div>
                  )}
                </div>
              )}

              {/* Main card */}
              <div className="bg-card border rounded-xl shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">AI Job Analyzer</span>
                  </div>
                  <button
                    onClick={() => setIsAIOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-4">
                  {/* Input */}
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Paste Job Description</Label>
                    <Textarea
                      placeholder="Paste a job description to extract company info, requirements, and get AI keyword matching..."
                      className="text-xs min-h-28 resize-none"
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                    />
                  </div>

                  <Button
                    onClick={analyzeJob}
                    disabled={!jobDescription.trim() || isParsing}
                    className="w-full gap-2 text-xs"
                    size="sm"
                  >
                    {isParsing ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {isParsing ? 'Analyzing…' : 'Analyze Job Description'}
                  </Button>
                </div>
              </div>

              {/* ── Step 1: Job Overview ─────────────────────────────────── */}
              {parsedJob && (
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                  <button
                    className="flex items-center justify-between w-full px-4 py-3 border-b hover:bg-muted/30 transition-colors"
                    onClick={() => setShowJobDetails(v => !v)}
                  >
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">
                        {parsedJob.company ?? 'Job Overview'}
                      </span>
                    </div>
                    {showJobDetails ? (
                      <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>

                  {showJobDetails && (
                    <div className="p-4 space-y-2">
                      {parsedJob.jobTitle && (
                        <p className="text-sm font-semibold text-foreground">
                          {parsedJob.jobTitle}
                        </p>
                      )}
                      <div className="space-y-1.5">
                        {parsedJob.location && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{parsedJob.location}</span>
                          </div>
                        )}
                        {parsedJob.experienceRequired && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Briefcase className="w-3.5 h-3.5 shrink-0" />
                            <span>{parsedJob.experienceRequired} experience required</span>
                          </div>
                        )}
                        {parsedJob.jobType && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>{parsedJob.jobType}</span>
                          </div>
                        )}
                        {parsedJob.workingHours && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>{parsedJob.workingHours}</span>
                          </div>
                        )}
                      </div>
                      {parsedJob.requiredSkills?.length > 0 && (
                        <div className="pt-2 border-t">
                          <p className="text-xs font-medium text-muted-foreground mb-1.5">
                            Required Skills
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {parsedJob.requiredSkills.map(s => (
                              <span
                                key={s}
                                className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 2: Profile Match ────────────────────────────────── */}
              {matchResults.length > 0 && (
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                  <button
                    className="flex items-center justify-between w-full px-4 py-3 border-b hover:bg-muted/30 transition-colors"
                    onClick={() => setShowMatchDetails(v => !v)}
                  >
                    <div className="flex items-center gap-2">
                      {requiredMatched === requiredTotal ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-amber-500" />
                      )}
                      <span className="font-semibold text-sm">Profile Match</span>
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                          requiredMatched === requiredTotal
                            ? 'bg-green-100 text-green-700'
                            : requiredMatched / requiredTotal >= 0.6
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {requiredMatched}/{requiredTotal}
                      </span>
                    </div>
                    {showMatchDetails ? (
                      <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>

                  {showMatchDetails && (
                    <div className="p-3 space-y-1">
                      {/* Required skills */}
                      {matchResults.filter(r => r.category === 'skill').length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-muted-foreground px-1 pt-1">
                            Required Skills
                          </p>
                          {matchResults
                            .filter(r => r.category === 'skill')
                            .map((r, i) => (
                              <div
                                key={i}
                                className={`flex items-start gap-2 px-2 py-1.5 rounded-lg text-xs ${
                                  r.matched
                                    ? 'bg-green-50 dark:bg-green-900/10'
                                    : 'bg-red-50 dark:bg-red-900/10'
                                }`}
                              >
                                {r.matched ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <span
                                    className={`font-medium ${r.matched ? 'text-green-800 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}
                                  >
                                    {r.item}
                                  </span>
                                  <p className="text-muted-foreground mt-0.5 truncate">
                                    {r.detail}
                                  </p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Experience */}
                      {matchResults
                        .filter(r => r.category === 'experience')
                        .map((r, i) => (
                          <div
                            key={i}
                            className={`flex items-start gap-2 px-2 py-1.5 rounded-lg text-xs mt-1 ${
                              r.matched
                                ? 'bg-green-50 dark:bg-green-900/10'
                                : 'bg-red-50 dark:bg-red-900/10'
                            }`}
                          >
                            {r.matched ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <span
                                className={`font-medium ${r.matched ? 'text-green-800 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}
                              >
                                Experience
                              </span>
                              <p className="text-muted-foreground mt-0.5">{r.detail}</p>
                            </div>
                          </div>
                        ))}

                      {/* Nice to have */}
                      {matchResults.filter(r => r.category === 'niceskill').length > 0 && (
                        <div className="space-y-1 mt-1">
                          <p className="text-xs font-semibold text-muted-foreground px-1 pt-1">
                            Nice to Have
                          </p>
                          {matchResults
                            .filter(r => r.category === 'niceskill')
                            .map((r, i) => (
                              <div
                                key={i}
                                className={`flex items-start gap-2 px-2 py-1.5 rounded-lg text-xs ${
                                  r.matched ? 'bg-green-50 dark:bg-green-900/10' : 'bg-muted/50'
                                }`}
                              >
                                {r.matched ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/40 mt-0.5 shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <span className="font-medium text-foreground/70">{r.item}</span>
                                  <p className="text-muted-foreground mt-0.5">{r.detail}</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 3: Keyword Cloud ────────────────────────────────── */}
              {(matchedKeywords.length > 0 || missingKeywords.length > 0) && (
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                  <button
                    className="flex items-center justify-between w-full px-4 py-3 border-b hover:bg-muted/30 transition-colors"
                    onClick={() => setShowKeywordCloud(v => !v)}
                  >
                    <span className="font-semibold text-sm">Keyword Cloud</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-green-600 font-medium">
                        {matchedKeywords.length} matched
                      </span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-amber-600 font-medium">
                        {missingKeywords.length} missing
                      </span>
                      {showKeywordCloud ? (
                        <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {showKeywordCloud && (
                    <div className="p-4 space-y-3">
                      {matchedKeywords.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                            ✓ In your resume
                          </p>
                          <WordCloud
                            keywords={matchedKeywords}
                            frequencies={keywordFrequencies}
                            isMatched
                          />
                        </div>
                      )}
                      {missingKeywords.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                            + Missing — click to add
                          </p>
                          <WordCloud
                            keywords={missingKeywords}
                            frequencies={keywordFrequencies}
                            isMatched={false}
                            onAdd={addKeywordToSkills}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 4: Suggestions ──────────────────────────────────── */}
              {currentKeywords && (
                <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-sm">AI Suggestions</span>
                    {suggestions.length > 0 && (
                      <button
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => setShowSuggestions(v => !v)}
                      >
                        {showSuggestions ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    {suggestions.length === 0 ? (
                      <Button
                        size="sm"
                        onClick={generateSuggestions}
                        disabled={isAnalyzing}
                        className="w-full text-xs gap-2"
                        variant="outline"
                      >
                        {isAnalyzing ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        {isAnalyzing ? 'Generating…' : 'Generate AI Suggestions'}
                      </Button>
                    ) : showSuggestions ? (
                      <SuggestionsList
                        suggestions={suggestions}
                        onApplySuggestion={applySuggestion}
                        onDismissSuggestion={dismissSuggestion}
                      />
                    ) : null}
                  </div>
                </div>
              )}

              {/* Reset */}
              {isModified && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-center">
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-2">
                    Preview shows AI-modified content. Resets on page refresh.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleReset}
                    className="text-xs gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset to Original
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
