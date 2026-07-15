import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { JobApplyCVModel } from '@/models/JobApplyCV';

export async function GET() {
  try {
    await connectMongo();
    const cvs = await JobApplyCVModel.find().sort({ created_at: -1 }).lean();
    return NextResponse.json(
      cvs.map((cv) => ({ _id: String(cv._id), name: cv.name, content: cv.content })),
    );
  } catch {
    return NextResponse.json({ message: 'Failed to load saved CVs.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, content } = body;

    if (!name?.trim() || !content?.trim()) {
      return NextResponse.json({ message: 'Name and CV text are required.' }, { status: 400 });
    }

    await connectMongo();

    const now = new Date().toISOString();
    const cv = await JobApplyCVModel.create({
      name: name.trim(),
      content: content.trim(),
      created_at: now,
      updated_at: now,
    });

    return NextResponse.json({ _id: String(cv._id), name: cv.name, content: cv.content });
  } catch {
    return NextResponse.json({ message: 'Failed to save CV.' }, { status: 500 });
  }
}
