'use client';
// Client component because it calls useRouter to navigate after form submission.
// The middleware in src/middleware.ts already redirects unauthenticated users
// before they reach this page.
import { useRouter } from 'next/navigation';
import EventForm, { type FormFields } from '@/src/components/event-form';

export default function CreateEventPage() {
  const router = useRouter();

  const handleSubmit = async (fields: FormFields) => {
    const res = await fetch('/api/create-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields),
    });
    const data = (await res.json()) as { id?: number; error?: string };
    // Throw so EventForm catches it and displays the message below the form
    if (!res.ok) throw new Error(data.error ?? 'Tapahtuman luonti epäonnistui');
    router.push(`/${data.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-display text-4xl font-bold text-ink mb-8">
        Luo tapahtuma
      </h1>
      <div className="bg-surface rounded-card border border-border shadow-(--shadow-card) p-8">
        <EventForm onSubmit={handleSubmit} submitLabel="Luo tapahtuma" />
      </div>
    </div>
  );
}
