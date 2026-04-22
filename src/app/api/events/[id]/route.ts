import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/src/lib/auth';
import { fetchEventById, deleteEvent } from '@/src/lib/dataFetching';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Kirjautuminen vaaditaan' }, { status: 401 });
  }

  const { id } = await params;
  const event = await fetchEventById(parseInt(id, 10));

  if (!event) {
    return NextResponse.json({ error: 'Tapahtumaa ei löydy' }, { status: 404 });
  }

  if (event.createdBy !== session.user.email) {
    return NextResponse.json({ error: 'Ei oikeutta poistaa tätä tapahtumaa' }, { status: 403 });
  }

  await deleteEvent(event.id);
  return NextResponse.json({ success: true });
}
