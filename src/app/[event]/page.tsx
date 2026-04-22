// Server component — fetches data at render time with no client-side JS needed.
// In Next.js App Router, params is a Promise because dynamic route segments are
// resolved asynchronously; we must await it before reading the value.
import { fetchEventById } from '@/src/lib/dataFetching';
import EventActions from '@/src/components/event-actions';

const EventPage = async ({
  params,
}: {
  params: Promise<{ event: string }>;
}) => {
  const resolvedParams = await params;
  // URL segments are always strings, so we parse to a number for the DB lookup
  const eventIdNumber = parseInt(resolvedParams.event, 10);
  const event = await fetchEventById(eventIdNumber);

  if (!event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-gray-700 dark:text-gray-300">Tapahtumaa ei löydy.</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-50 dark:bg-black">
      <img
        src={event.imgUrl}
        alt={event.title}
        className="w-full h-72 object-cover"
      />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          {event.title}
        </h1>
        <div className="flex gap-8 mb-8">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Päivämäärä
            </p>
            <p className="text-gray-900 dark:text-white">{event.date}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Kellonaika
            </p>
            <p className="text-gray-900 dark:text-white">{event.time || '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1">
              Sijainti
            </p>
            <p className="text-gray-900 dark:text-white">{event.location || '—'}</p>
          </div>
        </div>
        {event.description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {event.description}
          </p>
        )}
        {/* EventActions is a client component because it needs useSession to check
            if the logged-in user is the creator — that information is only
            available in the browser via React context */}
        <EventActions eventId={event.id} createdBy={event.createdBy} />
      </div>
    </div>
  );
};

export default EventPage;
