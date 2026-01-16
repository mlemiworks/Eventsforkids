import EventCard from '../components/eventCard';
import type { Event } from '../types/types';
import { fetchEvents } from '../lib/dataFetching';

export default async function Home() {
  const events: Event[] = await fetchEvents();

  return (
    <div className="flex min-h-screen items-top justify-center bg-zinc-50 font-sans dark:bg-black">
      {events.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          Ei saatavilla olevia tapahtumia.
        </p>
      ) : (
        <div className="h-full grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 sm:p-6 lg:p-8">
          {events.map((event: Event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
