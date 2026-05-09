import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface ResumeData {
  basics: {
    name: string;
    label: string;
    summary: string;
    email: string;
    phone: string;
  };
  work: Array<{
    name: string;
    position: string;
    summary: string;
    highlights: string[];
  }>;
  skills: Array<{
    name: string;
    keywords: string[];
  }>;
  projects: Array<{
    name: string;
    keywords: string[];
    highlights: string[];
  }>;
  education: Array<{
    institution: string;
    area: string;
    studyType: string;
  }>;
}

interface Keywords {
  technicalSkills: string[];
  softSkills: string[];
  tools: string[];
  phrases: string[];
}

interface Suggestion {
  section: string;
  field: string;
  original: string;
  suggested: string;
  keywords_added: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { resumeData, keywords } = await request.json();

    if (!resumeData) {
      return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
    }

    if (!keywords) {
      return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
    }

    const keywordsFlat = [
      ...(keywords.technicalSkills || []),
      ...(keywords.softSkills || []),
      ...(keywords.tools || []),
      ...(keywords.phrases || []),
    ].join(', ');

    const resumeJson = JSON.stringify(resumeData, null, 2);

    const prompt = `You are a professional CV writer and ATS optimization expert.

Analyze the following CV and keywords from a job description.
Suggest where and how to naturally insert keywords into the CV.
Do NOT rewrite the whole CV - only suggest improvements section-wise.

Instructions:
- For each section (Summary, Experience, Skills, Projects):
  - Identify missing keywords
  - Suggest exact lines to add or modify
- Keep suggestions concise and actionable
- Maintain natural human tone (not keyword stuffing)
- Return ONLY valid JSON, no additional text

Resume Data:
${resumeJson}

Keywords from Job Description:
${keywordsFlat}

Return in this exact JSON format:
{
  "suggestions": [
    {
      "section": "summary|skills|work|projects",
      "field": "summary|keywords|highlights",
      "original": "original text",
      "suggested": "improved text",
      "keywords_added": ["keyword1", "keyword2"]
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
    }

    const parsed = JSON.parse(result);
    const suggestions = parsed.suggestions || [];

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Generate suggestions error:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
