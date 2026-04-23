// No 'use client' here — this stays a server component so the initial fetch
// runs on the server and the HTML arrives pre-rendered. The interactive
// filtering/pagination is pushed down into HomeBrowser (a client component).
import type { Event } from '../types/types';
import { fetchEvents } from '../lib/dataFetching';
import HomeBrowser from '../components/home-browser';

export default async function Home() {
  const events: Event[] = await fetchEvents();
  // Pass the full event list to HomeBrowser; filtering happens client-side
  // so there's no round-trip to the server when the user changes filters.
  return <HomeBrowser events={events} />;
}
