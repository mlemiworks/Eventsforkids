'use client';
// useSession reads the current auth state from browser-side React context,
// which is why this must be a client component rather than a server component.
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {
  eventId: number;
  createdBy?: string;
};

export default function EventActions({ eventId, createdBy }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  // Render nothing if the user isn't logged in or isn't the event creator.
  // This hides the buttons entirely rather than showing them disabled,
  // since other users have no reason to interact with them.
  if (!session?.user?.email || session.user.email !== createdBy) return null;

  const handleDelete = async () => {
    if (!confirm('Haluatko varmasti poistaa tämän tapahtuman?')) return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    // Navigate home after deletion so the user doesn't land on a 404 page
    if (res.ok) router.push('/');
  };

  return (
    <div className="flex gap-3 mt-8">
      {/* Edit is intentionally disabled — the feature is planned but not built yet.
          Keeping the button visible makes it easy to wire up later without
          redesigning the layout. */}
      <button
        disabled
        className="px-4 py-2 text-sm text-gray-400 border border-gray-200 rounded dark:text-gray-600 dark:border-gray-700 cursor-not-allowed"
      >
        Muokkaa
      </button>
      <button
        onClick={handleDelete}
        className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950"
      >
        Poista
      </button>
    </div>
  );
}
