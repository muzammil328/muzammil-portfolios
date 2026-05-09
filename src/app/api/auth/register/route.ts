import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth/userService';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await registerUser(body);

    const response = NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 201 }
    );

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';

    if (message.includes('already registered')) {
      return NextResponse.json({ success: false, message }, { status: 409 });
    }

    if (/validation|required|invalid/i.test(message)) {
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
