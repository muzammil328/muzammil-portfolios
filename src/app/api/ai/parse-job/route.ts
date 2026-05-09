import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { jobDescription } = await request.json();
    if (!jobDescription?.trim()) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Extract structured information from this job description. Return ONLY valid JSON, no extra text.

Job Description:
${jobDescription}

Return in this exact format:
{
  "company": "company name or null",
  "jobTitle": "job title or null",
  "location": "location or null",
  "experienceRequired": "e.g. 2-3 Years or null",
  "experienceYearsMin": 0,
  "experienceYearsMax": 0,
  "jobType": "Full-Time / Part-Time / Contract or null",
  "workingHours": "working hours or null",
  "requiredSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1"],
  "responsibilities": ["responsibility1", "responsibility2"],
  "requirements": ["requirement1", "requirement2"]
}`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    const result = completion.choices[0]?.message?.content;
    if (!result)
      return NextResponse.json({ error: 'Failed to parse job description' }, { status: 500 });

    return NextResponse.json(JSON.parse(result));
  } catch (error) {
    console.error('Parse job error:', error);
    return NextResponse.json({ error: 'Failed to parse job description' }, { status: 500 });
  }
}
