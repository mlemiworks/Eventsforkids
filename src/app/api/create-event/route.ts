import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { createEvent } from '@/src/lib/dataFetching';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400';

export async function POST(request: NextRequest) {
  // getServerSession reads the JWT cookie on the server to verify the user is
  // logged in — the middleware already blocks the page, but we re-check here
  // because API routes are not covered by the middleware matcher
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
    // ?? '' falls back to an empty string for optional fields the user left blank
    time: body.time?.trim() ?? '',
    location: body.location?.trim() ?? '',
    description: body.description?.trim() ?? '',
    // || (not ??) because we also want the placeholder when imgUrl is an empty string
    imgUrl: body.imgUrl?.trim() || PLACEHOLDER_IMAGE,
    createdBy: session.user.email,
  });

  return NextResponse.json({ id: event.id });
}
