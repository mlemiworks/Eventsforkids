// No 'use client' here — this stays a server component so the initial fetch
// runs on the server and the HTML arrives pre-rendered. The interactive
// filtering/pagination is pushed down into HomeBrowser (a client component).
import { fetchEvents } from '../lib/dataFetching';
import HomeBrowser from '../components/home-browser';

// Tell Next.js to never cache this page — always fetch fresh data
// This is needed because new events can be added at any time
export const dynamic = 'force-dynamic';

export default async function Home() {
  const events = await fetchEvents();
  // Pass the full event list to HomeBrowser; filtering happens client-side
  // so there's no round-trip to the server when the user changes filters.
  return <HomeBrowser events={events} />;
}
