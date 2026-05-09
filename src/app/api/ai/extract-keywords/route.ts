import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

interface KeywordResponse {
  technicalSkills: string[];
  softSkills: string[];
  tools: string[];
  phrases: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json();

    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    const prompt = `You are an ATS (Applicant Tracking System) expert.

Analyze the following job description and extract relevant keywords for a CV.

Instructions:
- Extract hard skills, soft skills, tools, technologies, and role-specific keywords
- Group them into categories:
  1. Technical Skills (programming languages, frameworks, methodologies, technical knowledge)
  2. Soft Skills (communication, leadership, problem-solving, teamwork)
  3. Tools & Technologies (software, platforms, databases, cloud services)
  4. Keywords/Phrases (ATS optimized role-specific terms)
- Avoid duplicates
- Keep keywords concise (1-3 words each)
- Return ONLY valid JSON, no additional text

Job Description:
${jobDescription}

Return in this exact JSON format:
{
  "technicalSkills": [],
  "softSkills": [],
  "tools": [],
  "phrases": []
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      return NextResponse.json({ error: 'Failed to generate keywords' }, { status: 500 });
    }

    const parsed = JSON.parse(result) as KeywordResponse;

    return NextResponse.json({
      technicalSkills: parsed.technicalSkills || [],
      softSkills: parsed.softSkills || [],
      tools: parsed.tools || [],
      phrases: parsed.phrases || [],
    });
  } catch (error) {
    console.error('Extract keywords error:', error);
    return NextResponse.json({ error: 'Failed to extract keywords' }, { status: 500 });
  }
}
