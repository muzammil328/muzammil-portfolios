export interface PromptChunk {
  label: string;
  content: string;
}

function referenceDataBlock(sections: { label: string; content: string }[]): string {
  return sections
    .filter((section) => section.content.trim())
    .map((section) => `## ${section.label}\n\n${section.content.trim()}`)
    .join('\n\n---\n\n');
}

const READY_INSTRUCTION =
  "I will now ask you to run ONE step at a time, in order (Step 1 through Step 4). Wait for each request below and output only that step's result — do not run ahead. Before I send the first request, reply with 'Ready' followed by a short bulleted echo of every field in the Personal Data section above (same labels and values) so I can confirm you received it correctly.";

const PERSONAL_DATA = [
  '## Personal Data',
  '',
  '- Full Name: Muzammal Safdar',
  '- Email Address: mmuzammilsafdar3@gmail.com',
  '- Phone Number: +92 370 0810327',
  '- Current Monthly Salary: PKR 55,000',
  "- Desired Monthly Salary: PKR 90,000 (convert to the job posting's currency if it differs from PKR)",
  '- Total Years of Professional Software Development Experience: 2+ years',
  '- Remote Team Comfort (1-10 scale): 7',
  '- Portfolio / GitHub / Work Samples: https://mmuzammil-portfolio.vercel.app · https://github.com/Muzammil327',
  '- Notice Period With Current Employer: 30 days',
].join('\n');

export function buildJobApplyChunks(params: {
  mainPrompt: string;
  profileContent: string;
  experiencesContent: string;
  projectsContent: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  jobDescription: string;
  cvText: string;
}): PromptChunk[] {
  const setup = [
    params.mainPrompt,
    '',
    '---',
    '',
    referenceDataBlock([
      { label: 'Profile', content: params.profileContent },
      { label: 'Experience', content: params.experiencesContent },
      { label: 'Projects', content: params.projectsContent },
    ]),
    '',
    '---',
    '',
    PERSONAL_DATA,
    '',
    '---',
    '',
    '## CV',
    '',
    params.cvText.trim() || '[No CV selected — rely on Profile/Experience/Projects above only]',
    '',
    '---',
    '',
    '## Job Posting',
    '',
    params.jobDescription.trim() || '[Paste job description here]',
    '',
    '---',
    '',
    "Compare the Job Posting against my CV and Personal Data above, and be ready to flag which required points I'm weak or missing on in Step 1 — do not soften or skip gaps.",
    '',
    '---',
    '',
    READY_INSTRUCTION,
  ].join('\n');

  const stepChunk = (label: string, body: string, instruction: string): PromptChunk => ({
    label,
    content: [
      `## Run ${label}`,
      '',
      body,
      '',
      '---',
      '',
      instruction,
    ].join('\n'),
  });

  return [
    { label: 'Setup', content: setup },
    stepChunk(
      'Step 1 — Extract & Match',
      params.step1,
      "Output ONLY Step 1's analysis now (Extract, Match table, Fit Score, Missing Skills, Where You're Weak). Do not write the email yet."
    ),
    stepChunk(
      'Step 2 — Write Email',
      params.step2,
      'Output ONLY the email now, using the matches established in Step 1. Do not repeat Step 1\'s analysis or disclose any gaps.'
    ),
    stepChunk(
      'Step 3 — Missing Skills List',
      params.step3,
      'Output ONLY the Missing Skills List now, per the format above.'
    ),
    stepChunk(
      'Step 4 — Rewrite Resume for ATS',
      params.step4,
      "Output ONLY the rewritten resume now, using Step 1's analysis. Do not repeat Step 1-3's output."
    ),
  ];
}
