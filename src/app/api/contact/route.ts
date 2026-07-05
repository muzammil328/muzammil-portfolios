import { NextResponse } from 'next/server';
import { connectMongo } from '@/lib/mongodb';
import { ContactFormModel } from '@/models/ContactForm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fname, lname, email, phone, message, website, ...rest } = body;

    if (typeof website === 'string' && website.length > 0) {
      return NextResponse.json({ success: false, message: 'Invalid submission.' }, { status: 400 });
    }

    if (!fname?.trim() || !lname?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ success: false, message: 'Required fields are missing.' }, { status: 400 });
    }

    if (!message?.trim() || message.trim().length < 20) {
      return NextResponse.json({ success: false, message: 'Message must be at least 20 characters.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Invalid email address.' }, { status: 400 });
    }

    await connectMongo();

    const now = new Date().toISOString();
    const doc = {
      fname: fname.trim(),
      lname: lname.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      created_at: now,
      submitted_at: now,
      ...Object.fromEntries(
        Object.entries(rest).map(([k, v]) => [k.replace(/([A-Z])/g, '_$1').toLowerCase(), v ?? null]),
      ),
    };

    await ContactFormModel.create(doc);

    return NextResponse.json({ success: true, message: 'Message sent successfully!' });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again later.' },
      { status: 500 },
    );
  }
}
