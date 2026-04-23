import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { createEvent } from '@/src/lib/dataFetching';
import { CATEGORIES } from '@/src/lib/categories';
import type { Category } from '@/src/types/types';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400';

export async function POST(request: NextRequest) {
  // getServerSession reads the JWT cookie on the server to verify the user is
  // logged in — the middleware blocks the page, but API routes need their own check
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
    // New optional fields
    category?: string;
    city?: string;
    age?: string;
    price?: string; // arrives as string from the form's number input
  };

  const { title, date } = body;
  if (!title?.trim() || !date?.trim()) {
    return NextResponse.json(
      { error: 'Otsikko ja päivämäärä ovat pakollisia' },
      { status: 400 },
    );
  }

  // Validate category against the known list — reject anything outside it
  // Widened to string[] so .includes() accepts the plain string from the request body.
  // Without this, TypeScript infers Category[] and rejects string arguments.
  const validKeys: string[] = CATEGORIES.map((c) => c.key);
  const category: Category | undefined = validKeys.includes(body.category ?? '')
    ? (body.category as Category)
    : undefined;

  // price arrives as a string ("0", "8.5", ""); convert to number or leave undefined
  const priceNum = body.price !== '' && body.price != null
    ? Number(body.price)
    : undefined;

  const event = await createEvent({
    title:       title.trim(),
    date:        date.trim(),
    time:        body.time?.trim() ?? '',
    location:    body.location?.trim() ?? '',
    description: body.description?.trim() ?? '',
    // || because we also want the placeholder when imgUrl is an empty string
    imgUrl:      body.imgUrl?.trim() || PLACEHOLDER_IMAGE,
    category,
    city:        body.city?.trim() || undefined,
    age:         body.age?.trim()  || undefined,
    price:       priceNum,
    createdBy:   session.user.email,
  });

  return NextResponse.json({ id: event.id });
}
