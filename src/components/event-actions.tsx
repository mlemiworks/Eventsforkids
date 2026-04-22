'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type Props = {
  eventId: number;
  createdBy?: string;
};

export default function EventActions({ eventId, createdBy }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user?.email || session.user.email !== createdBy) return null;

  const handleDelete = async () => {
    if (!confirm('Haluatko varmasti poistaa tämän tapahtuman?')) return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    if (res.ok) router.push('/');
  };

  return (
    <div className="flex gap-3 mt-8">
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
