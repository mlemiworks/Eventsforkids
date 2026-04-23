// Server component — fetches the event before rendering so the client form
// can be pre-filled without a loading state or a useEffect in the browser.
import { redirect } from 'next/navigation';
import { fetchEventById } from '@/src/lib/dataFetching';
import EditEventClient from './client';

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ event: string }>;
}) {
  const { event: idStr } = await params;
  const event = await fetchEventById(parseInt(idStr, 10));

  // If the event doesn't exist, send the user home rather than showing an error page
  if (!event) redirect('/');

  return <EditEventClient event={event} />;
}
