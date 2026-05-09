import { NextRequest, NextResponse } from 'next/server';
import { submitContactForm } from '@/lib/contactForms';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await submitContactForm(body);

    return NextResponse.json(result, { status: result.success ? 201 : 400 });
  } catch (error: unknown) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? (error as Error)?.message : undefined,
      },
      { status: 500 }
    );
  }
}
