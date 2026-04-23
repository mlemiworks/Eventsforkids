// Server component — runs on the server so getServerSession works directly.
// The middleware in middleware.ts already redirects unauthenticated users.
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/lib/auth';
import { fetchEvents } from '@/src/lib/dataFetching';
import EventCard from '@/src/components/eventCard';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  // Middleware should have redirected, but guard here too in case it's called directly
  if (!session?.user?.email) redirect('/');

  const all    = await fetchEvents();
  const mine   = all.filter((e) => e.createdBy === session.user!.email);

  // ISO date string comparison works correctly for yyyy-mm-dd format
  const today    = new Date().toISOString().slice(0, 10);
  const upcoming = mine.filter((e) => e.date >= today).length;
  const past     = mine.length - upcoming;
  // Set deduplicates cities; filter(Boolean) removes undefined/empty values
  const cities   = new Set(mine.map((e) => e.city).filter(Boolean)).size;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-ink mb-8">
        Omat tapahtumat
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <Stat tone="primary"   label="Tapahtumia" value={mine.length} />
        <Stat tone="secondary" label="Tulevia"    value={upcoming} />
        <Stat tone="accent"    label="Menneitä"   value={past} />
        <Stat tone="warn"      label="Kaupunkeja" value={cities} />
      </div>

      {mine.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-ink-soft mb-4">Et ole vielä luonut tapahtumia.</p>
          <a
            href="/create-event"
            className="rounded-full bg-primary text-primary-ink font-semibold px-6 py-3 hover:brightness-95 transition-colors"
          >
            Luo ensimmäinen tapahtuma
          </a>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      )}
    </div>
  );
}

// Local component — only used on this page, not worth a separate file
function Stat({
  tone,
  label,
  value,
}: {
  tone: 'primary' | 'secondary' | 'accent' | 'warn';
  label: string;
  value: number;
}) {
  // Record maps every tone to its Tailwind bg + text pair
  const styles: Record<typeof tone, string> = {
    primary:   'bg-primary text-primary-ink',
    secondary: 'bg-secondary text-secondary-ink',
    accent:    'bg-accent text-accent-ink',
    warn:      'bg-warn text-warn-ink',
  };
  return (
    <div className={`rounded-card p-5 ${styles[tone]}`}>
      <div className="font-display text-3xl font-bold">{value}</div>
      <div className="text-sm font-semibold opacity-80 mt-1">{label}</div>
    </div>
  );
}
