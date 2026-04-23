// Server component — data is fetched at render time, no client JS needed.
// params is a Promise in Next.js App Router because dynamic segments are
// resolved asynchronously; we must await it before reading the value.
import Link from 'next/link';
import { fetchEventById } from '@/src/lib/dataFetching';
import EventActions from '@/src/components/event-actions';
import { CATEGORY_BY_KEY } from '@/src/lib/categories';
import {
  Illustration,
  IllustrationId,
} from '@/src/components/ui/Illustrations';

// Full Finnish long-form date: "lauantai 19. huhtikuuta 2025"
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fi-FI', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const isValidUrl = (value?: string) => {
  if (!value) return false;
  return (
    value.startsWith('http://') ||
    value.startsWith('https://') ||
    value.startsWith('/testImages')
  );
};

export default async function EventPage({
  params,
}: {
  params: Promise<{ event: string }>;
}) {
  const { event: idStr } = await params;
  const event = await fetchEventById(parseInt(idStr, 10));

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="text-ink-soft mb-4">Tapahtumaa ei löydy.</p>
        <Link href="/" className="text-ink underline hover:opacity-70">
          Takaisin etusivulle
        </Link>
      </div>
    );
  }

  // Look up category metadata for the tinted image backdrop and badge
  const cat = event.category ? CATEGORY_BY_KEY[event.category] : null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Link
        href="/"
        className="text-sm text-ink-soft hover:text-ink mb-6 inline-block"
      >
        ← Takaisin
      </Link>

      {/*
        Two-column grid: left 2/3 for content, right 1/3 for the info sidebar.
        On small screens they stack vertically (grid default, no sm: override).
        grid-cols-[2fr_1fr] is an arbitrary Tailwind value — the brackets let us
        write any valid CSS grid-template-columns value.
      */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Image with category-tinted backdrop as a fallback behind the photo */}
          <div
            className="aspect-16/9 w-full rounded-card overflow-hidden mb-6"
            style={{ background: cat?.color ?? 'var(--color-surface-soft)' }}
          >
            {isValidUrl(event.imgUrl) ? (
              <img
                src={event.imgUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : event.imgUrl ? (
              <Illustration
                id={event.imgUrl as IllustrationId}
                className="w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-display text-5xl font-bold opacity-30">
                {event.title.charAt(0)}
              </div>
            )}
          </div>

          {/* Category + age badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {cat && (
              <span
                className="rounded-pill px-3 py-1 text-sm font-bold"
                style={{ background: cat.color, color: cat.ink }}
              >
                {cat.name}
              </span>
            )}
            {event.age && (
              <span className="rounded-pill bg-surface-soft text-ink px-3 py-1 text-sm font-semibold">
                Ikä {event.age}
              </span>
            )}
          </div>

          <h1 className="font-display text-4xl font-bold text-ink mb-4 leading-tight">
            {event.title}
          </h1>

          {event.description && (
            <p className="text-ink-soft text-lg leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        {/* ── RIGHT SIDEBAR ── */}
        <aside className="flex flex-col gap-4">
          {/* Info card */}
          <div className="bg-surface rounded-card border border-border shadow-(--shadow-card) p-6">
            <InfoRow
              label="Milloin"
              value={`${formatDate(event.date)}${event.time ? ` klo ${event.time}` : ''}`}
            />
            <InfoRow
              label="Missä"
              value={
                event.city ? `${event.location}, ${event.city}` : event.location
              }
            />
            {event.createdBy && (
              <InfoRow label="Järjestäjä" value={event.createdBy} />
            )}
            <InfoRow
              label="Hinta"
              value={
                event.price === 0
                  ? 'Ilmainen'
                  : event.price != null
                    ? `${event.price} €`
                    : '—'
              }
              last
            />
          </div>

          {/* Delete / edit — only rendered for the event creator */}
          <EventActions eventId={event.id} createdBy={event.createdBy} />
        </aside>
      </div>
    </div>
  );
}

// Local helper — only used on this page, so no need to extract to a separate file.
// `last` omits the bottom border on the final row.
function InfoRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-start py-3 ${last ? '' : 'border-b border-border'}`}
    >
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="text-sm font-semibold text-ink text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
