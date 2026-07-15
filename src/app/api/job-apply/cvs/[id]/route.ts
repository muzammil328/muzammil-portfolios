import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { JobApplyCVModel } from '@/models/JobApplyCV';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, content } = body;

    if (!name?.trim() || !content?.trim()) {
      return NextResponse.json({ message: 'Name and CV text are required.' }, { status: 400 });
    }

    await connectMongo();

    const cv = await JobApplyCVModel.findByIdAndUpdate(
      id,
      { name: name.trim(), content: content.trim(), updated_at: new Date().toISOString() },
      { new: true },
    );

    if (!cv) {
      return NextResponse.json({ message: 'CV not found.' }, { status: 404 });
    }

    return NextResponse.json({ _id: String(cv._id), name: cv.name, content: cv.content });
  } catch {
    return NextResponse.json({ message: 'Failed to update CV.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectMongo();
    await JobApplyCVModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ message: 'Failed to delete CV.' }, { status: 500 });
  }
}
