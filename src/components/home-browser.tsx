'use client';
// This is a client component because it owns interactive state (filters, page).
// It receives the full event list from the server component above so the initial
// HTML is still pre-rendered — only state changes happen in the browser.
import { useMemo, useState } from 'react';
import type { Event, Category } from '../types/types';
import EventCard from './eventCard';
import { CATEGORIES, CITIES } from '../lib/categories';

const PAGE_SIZE = 9;

export default function HomeBrowser({ events }: { events: Event[] }) {
  const [q, setQ]       = useState('');
  const [city, setCity] = useState('');
  // '' means "all categories"; Category is the union type from types.ts
  const [cat, setCat]   = useState<Category | ''>('');
  const [page, setPage] = useState(1);

  // useMemo re-computes only when the dependency values actually change —
  // without it, filtering would run on every render (e.g. on unrelated state updates).
  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (cat  && e.category !== cat)  return false;
      if (city && e.city     !== city) return false;
      if (q) {
        const haystack = `${e.title} ${e.description}`.toLowerCase();
        if (!haystack.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [events, q, city, cat]);

  // Math.max keeps pages at least 1 so the pagination bar always renders cleanly
  const pages     = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Helper so every filter change also resets to page 1
  const filter = (fn: () => void) => { fn(); setPage(1); };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* Hero */}
      <div className="mb-10">
        <h1 className="font-display text-5xl font-bold text-ink mb-3">
          Löydä tapahtumia lapsille
        </h1>
        <p className="text-ink-soft text-lg max-w-2xl">
          Kaikki lapsille sopivat tapahtumat yhdestä paikasta.
        </p>
      </div>

      {/* Search + city row */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/*
          Plain <input> (not the Input primitive) so flex-1 controls width freely
          without fighting the w-full that the primitive bakes in.
        */}
        <input
          value={q}
          onChange={(e) => filter(() => setQ(e.target.value))}
          placeholder="Etsi tapahtumia..."
          className="flex-1 min-w-60 rounded-xl border border-border bg-surface px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary"
        />
        <select
          value={city}
          onChange={(e) => filter(() => setCity(e.target.value))}
          className="rounded-xl border border-border bg-surface px-4 py-3 text-ink focus:outline-none focus:border-primary"
        >
          <option value="">Kaikki kaupungit</option>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => filter(() => setCat(''))}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            cat === '' ? 'bg-ink text-bg' : 'bg-surface-soft text-ink hover:bg-border'
          }`}
        >
          Kaikki
        </button>
        {CATEGORIES.map((c) => (
          // Toggle: clicking the active category deselects it
          <button
            key={c.key}
            onClick={() => filter(() => setCat(c.key === cat ? '' : c.key))}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              cat === c.key
                ? 'ring-2 ring-ink ring-offset-2 ring-offset-bg'
                : ''
            }`}
            style={{ background: c.color, color: c.ink }}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Grid / empty state */}
      {filtered.length === 0 ? (
        <p className="text-ink-soft py-20 text-center">
          Ei tapahtumia hakuehdoilla.
        </p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>

          {/* Pagination — only rendered when there's more than one page */}
          {pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-full font-semibold transition-colors ${
                    page === i + 1
                      ? 'bg-ink text-bg'
                      : 'bg-surface text-ink hover:bg-surface-soft'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
