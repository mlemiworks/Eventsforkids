// Server component — fetches the full event list, then renders the interactive
// table in a client component so search can filter without server round-trips.
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { fetchEvents } from '@/src/lib/dataFetching';
import AdminClient from './client';

// Keep the admin email in one place so it's easy to change later.
// If you add a `role` field to User this check moves into auth.ts instead.
export const ADMIN_EMAIL = 'admin@example.fi';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.email !== ADMIN_EMAIL) redirect('/');

  const events = await fetchEvents();
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-ink mb-8">
        Hallinta
      </h1>
      <AdminClient events={events} />
    </div>
  );
}
