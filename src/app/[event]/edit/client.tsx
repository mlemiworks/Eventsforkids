'use client';
// Owns the PUT fetch and navigation after save.
// Receives the pre-fetched event from the server page above so no useEffect needed.
import { useRouter } from 'next/navigation';
import type { Event } from '@/src/lib/dataFetching';
import EventForm, {
  eventToFormFields,
  type FormFields,
} from '@/src/components/event-form';

export default function EditEventClient({ event }: { event: Event }) {
  const router = useRouter();

  const handleSubmit = async (fields: FormFields) => {
    const res = await fetch(`/api/events/${event.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const data = (await res.json()) as { id?: number; error?: string };
    if (!res.ok) throw new Error(data.error ?? 'Tallentaminen epäonnistui');
    // refresh() tells Next.js to invalidate the server component cache for the
    // detail page so it shows the updated data when we navigate back to it
    router.push(`/${event.id}`);
    router.refresh();
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-ink mb-8">
        Muokkaa tapahtumaa
      </h1>
      <div className="bg-surface rounded-card border border-border shadow-(--shadow-card) p-8">
        <EventForm
          initial={eventToFormFields(event)}
          onSubmit={handleSubmit}
          submitLabel="Tallenna muutokset"
        />
      </div>
    </div>
  );
}
