import { NextRequest, NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/userService';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await loginUser(body);

    const response = NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );

    response.cookies.set('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Login failed';

    if (message.includes('Invalid') || message.includes('inactive')) {
      return NextResponse.json({ success: false, message }, { status: 401 });
    }

    if (/validation|required/i.test(message)) {
      return NextResponse.json({ success: false, message }, { status: 400 });
    }

    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
