import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/src/lib/dataFetching';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string };
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Sähköposti ja salasana vaaditaan' },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: 'Salasanan tulee olla vähintään 8 merkkiä' },
      { status: 400 }
    );
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    return NextResponse.json(
      { error: 'Sähköposti on jo käytössä' },
      { status: 400 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await createUser(email, passwordHash);

  return NextResponse.json({ success: true });
}
