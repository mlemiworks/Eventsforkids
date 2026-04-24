'use client';
// useSession reads the current auth state from browser-side React context,
// which is why this must be a client component rather than a server component.
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';

type Props = {
  // IDs are now cuid strings from Prisma, not numbers
  eventId: string;
  createdBy?: string | null;
};

export default function EventActions({ eventId, createdBy }: Props) {
  const { data: session } = useSession();
  const router = useRouter();

  // Render nothing if the user isn't logged in or isn't the event creator.
  // Hiding buttons entirely is cleaner than showing disabled ones to non-owners.
  if (!session?.user?.email || session.user.email !== createdBy) return null;

  const handleDelete = async () => {
    if (!confirm('Haluatko varmasti poistaa tämän tapahtuman?')) return;
    const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
    // Navigate home after deletion so the user doesn't land on a 404
    if (res.ok) router.push('/');
  };

  return (
    <div className="flex gap-3">
      {/*
        Link styled to look like Button variant="secondary". We can't use the Button
        component directly here because it renders a <button>, not an <a>, and nesting
        an <a> inside a <button> is invalid HTML. The classes are copied from Button's
        secondary variant + md size.
      */}
      <Link
        href={`/${eventId}/edit`}
        className="rounded-full font-semibold transition-colors bg-surface-soft text-ink hover:bg-border px-4 py-2 text-base"
      >
        Muokkaa
      </Link>
      <Button variant="danger" size="md" onClick={handleDelete}>
        Poista
      </Button>
    </div>
  );
}
