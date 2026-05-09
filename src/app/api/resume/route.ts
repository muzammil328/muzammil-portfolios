import { NextRequest, NextResponse } from 'next/server';
import { requireFeature, extractAuth } from '@/lib/auth/guards';
import { createResume, listResumes } from '@/lib/resumes';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const payload = await requireFeature(req, 'resume');
  if (payload instanceof NextResponse) return payload;

  const isAdmin = payload.role === 'admin';

  // Admin users don't get MongoDB resumes - they use default from Sanity
  if (isAdmin) {
    return NextResponse.json([]);
  }

  const userId = payload.user_id;

  try {
    const resumes = await listResumes(userId, isAdmin);
    return NextResponse.json(resumes);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch resumes';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const payload = await requireFeature(req, 'resume');
  if (payload instanceof NextResponse) return payload;

  // Admin users cannot create their own resumes - they use default from Sanity
  if (payload.role === 'admin') {
    return NextResponse.json(
      {
        success: false,
        message: 'Admin users cannot create resumes. Use the default resume from Sanity.',
      },
      { status: 403 }
    );
  }

  const userId = payload.user_id;

  try {
    // Check if user already has a resume (limit to 1)
    const existingResumes = await listResumes(userId, false);
    if (existingResumes.length >= 1) {
      return NextResponse.json(
        {
          success: false,
          message: 'You can only have one resume. Delete existing one to create a new one.',
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const created = await createResume(body, userId);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create resume';
    const status = /required|invalid/i.test(message) ? 400 : 500;
    return NextResponse.json({ success: false, message }, { status });
  }
}
