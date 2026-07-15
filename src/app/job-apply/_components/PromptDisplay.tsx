'use client';

import { useMemo, useState } from 'react';
import { buildJobApplyChunks } from './promptChunks';
import SavedCVSelector, { type SavedCV } from './SavedCVSelector';

interface PromptDisplayProps {
  mainPrompt: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;
  profileContent: string;
  experiencesContent: string;
  projectsContent: string;
}

export default function PromptDisplay({
  mainPrompt,
  step1,
  step2,
  step3,
  step4,
  step5,
  profileContent,
  experiencesContent,
  projectsContent,
}: PromptDisplayProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [savedCv, setSavedCv] = useState<SavedCV | null>(null);
  const [started, setStarted] = useState(false);
  const [chunkIndex, setChunkIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const cvText = savedCv?.content ?? '';

  const chunks = useMemo(
    () =>
      buildJobApplyChunks({
        mainPrompt,
        profileContent,
        experiencesContent,
        projectsContent,
        step1,
        step2,
        step3,
        step4,
        step5,
        jobDescription,
        cvText,
      }),
    [
      mainPrompt,
      profileContent,
      experiencesContent,
      projectsContent,
      step1,
      step2,
      step3,
      step4,
      step5,
      jobDescription,
      cvText,
    ]
  );

  const activeChunk = chunks[chunkIndex];

  const handleStart = () => {
    setStarted(true);
    setChunkIndex(0);
  };

  const handleCopy = async () => {
    if (!activeChunk) return;
    await navigator.clipboard.writeText(activeChunk.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Job Application Prompt Generator</h1>
          <p className="text-gray-600">
            Paste a job posting and your CV text, then generate the prompt as a sequence of small
            chunks. Copy the Setup chunk into a new AI chat first, wait for it to confirm
            it&apos;s ready, then copy each step chunk in order — Step 1 analyzes gaps against
            the job, Step 2 writes the email, Step 3 lists missing skills, Step 4 rewrites your
            resume around the job&apos;s focus keywords for ATS, Step 5 outputs the final resume
            plus an honest gap analysis.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="job-description" className="block text-sm font-semibold text-gray-800">
            Job Description
          </label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job posting here..."
            className="w-full h-48 p-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y text-sm leading-relaxed"
          />
        </div>

        <SavedCVSelector onSelect={setSavedCv} />

        <button
          onClick={handleStart}
          disabled={!savedCv}
          className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed"
          title={savedCv ? undefined : 'Select a CV first'}
        >
          Generate Prompt
        </button>

        {started && activeChunk && (
          <div className="space-y-3 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-800">
                  Chunk {chunkIndex + 1} of {chunks.length}: {activeChunk.label}
                </span>
                <div className="flex gap-1">
                  {chunks.map((chunk, i) => (
                    <span
                      key={`${i}-${chunk.label}`}
                      className={`h-1.5 w-5 rounded-full ${
                        i === chunkIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setChunkIndex((i) => Math.max(0, i - 1))}
                  disabled={chunkIndex === 0}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setChunkIndex((i) => Math.min(chunks.length - 1, i + 1))}
                  disabled={chunkIndex === chunks.length - 1}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-3 right-3 z-10">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur text-sm font-medium text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <pre className="w-full h-[600px] p-5 bg-gray-900 text-gray-100 text-sm font-mono rounded-lg overflow-auto whitespace-pre-wrap leading-relaxed">
                {activeChunk.content}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
