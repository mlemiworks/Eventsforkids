import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { createEvent } from '@/src/lib/dataFetching';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Kirjautuminen vaaditaan' }, { status: 401 });
  }

  const body = (await request.json()) as {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    description?: string;
    imgUrl?: string;
  };

  const { title, date } = body;

  if (!title?.trim() || !date?.trim()) {
    return NextResponse.json(
      { error: 'Otsikko ja päivämäärä ovat pakollisia' },
      { status: 400 }
    );
  }

  const event = await createEvent({
    title: title.trim(),
    date: date.trim(),
    time: body.time?.trim() ?? '',
    location: body.location?.trim() ?? '',
    description: body.description?.trim() ?? '',
    imgUrl: body.imgUrl?.trim() || PLACEHOLDER_IMAGE,
    createdBy: session.user.email,
  });

  return NextResponse.json({ id: event.id });
}
