import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { fetchEventById, deleteEvent, updateEvent } from '@/src/lib/dataFetching';
import { CATEGORIES } from '@/src/lib/categories';
import type { Category } from '@/src/types/types';
// Import the admin email constant so it lives in one place
import { ADMIN_EMAIL } from '@/src/app/admin/page';

// Shared auth + ownership guard used by both DELETE and PUT
async function resolveEvent(params: Promise<{ id: string }>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return { error: 'Kirjautuminen vaaditaan', status: 401 } as const;

  const { id } = await params;
  const event = await fetchEventById(parseInt(id, 10));
  if (!event) return { error: 'Tapahtumaa ei löydy', status: 404 } as const;

  // Admin can modify any event; regular users only their own
  const isAdmin = session.user.email === ADMIN_EMAIL;
  if (!isAdmin && event.createdBy !== session.user.email) {
    return { error: 'Ei oikeutta muokata tätä tapahtumaa', status: 403 } as const;
  }

  return { event, email: session.user.email };
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const result = await resolveEvent(params);
  // TypeScript narrows the union: 'error' in result tells TS which branch we're in
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  await deleteEvent(result.event.id);
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const result = await resolveEvent(params);
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const body = (await request.json()) as {
    title?: string;
    date?: string;
    time?: string;
    location?: string;
    description?: string;
    imgUrl?: string;
    category?: string;
    city?: string;
    age?: string;
    price?: string;
  };

  if (!body.title?.trim() || !body.date?.trim()) {
    return NextResponse.json(
      { error: 'Otsikko ja päivämäärä ovat pakollisia' },
      { status: 400 },
    );
  }

  const validKeys: string[] = CATEGORIES.map((c) => c.key);
  const category: Category | undefined = validKeys.includes(body.category ?? '')
    ? (body.category as Category)
    : undefined;

  const priceNum = body.price !== '' && body.price != null
    ? Number(body.price)
    : undefined;

  const updated = await updateEvent(result.event.id, {
    title:       body.title.trim(),
    date:        body.date.trim(),
    time:        body.time?.trim() ?? '',
    location:    body.location?.trim() ?? '',
    description: body.description?.trim() ?? '',
    imgUrl:      body.imgUrl?.trim() || result.event.imgUrl,
    category,
    city:        body.city?.trim()  || undefined,
    age:         body.age?.trim()   || undefined,
    price:       priceNum,
  });

  return NextResponse.json({ id: updated?.id });
}
