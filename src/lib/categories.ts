// Importing a type with `import type` tells TypeScript (and bundlers) this import
// is only used for type-checking, never at runtime — it gets erased from the output.
import type { Category } from '../types/types';

// CATEGORIES is the single source of truth for category metadata.
// Components that need display name, badge color, or ink color import this
// rather than hard-coding values in multiple places.
export const CATEGORIES: {
  key: Category;
  name: string;
  color: string; // CSS value used as background — references @theme tokens
  ink: string; // text color chosen for legibility on that background
}[] = [
  {
    key: 'musiikki',
    name: 'Musiikki',
    color: 'var(--color-cat-musiikki)',
    ink: '#4a1f5c',
  },
  {
    key: 'liikunta',
    name: 'Liikunta',
    color: 'var(--color-cat-liikunta)',
    ink: '#5a2e00',
  },
  {
    key: 'taide',
    name: 'Taide',
    color: 'var(--color-cat-taide)',
    ink: '#6b1a2c',
  },
  {
    key: 'teatteri',
    name: 'Teatteri',
    color: 'var(--color-cat-teatteri)',
    ink: '#0f3050',
  },
  {
    key: 'sirkus',
    name: 'Sirkus ja Tanssi',
    color: 'var(--color-cat-sirkus)',
    ink: '#3d3800',
  },
  {
    key: 'luonto',
    name: 'Luonto',
    color: 'var(--color-cat-luonto)',
    ink: '#1a3a24',
  },
  { key: 'muu', name: 'Muu', color: 'var(--color-cat-muu)', ink: '#000000' },
];

// Object.fromEntries converts the array into a lookup map keyed by category key,
// e.g. CATEGORY_BY_KEY['musiikki'] → { key, name, color, ink }.
// This avoids calling .find() every time a component needs one category's metadata.
export const CATEGORY_BY_KEY = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c]),
) as Record<Category, (typeof CATEGORIES)[number]>;

// City list for the filter dropdown and the create-event form
export const CITIES = [
  { name: 'Helsinki', lat: 60.1699, lng: 24.9384 },
  { name: 'Espoo', lat: 60.2052, lng: 24.6522 },
  { name: 'Tampere', lat: 61.4978, lng: 23.761 },
  { name: 'Vantaa', lat: 60.2934, lng: 25.0378 },
  { name: 'Oulu', lat: 65.0121, lng: 25.4651 },
  { name: 'Turku', lat: 60.4518, lng: 22.2666 },
  { name: 'Jyväskylä', lat: 62.2426, lng: 25.7473 },
  { name: 'Lahti', lat: 60.9827, lng: 25.6612 },
  { name: 'Kuopio', lat: 62.898, lng: 27.6782 },
  { name: 'Pori', lat: 61.4851, lng: 21.7971 },
  { name: 'Joensuu', lat: 62.601, lng: 29.7636 },
  { name: 'Lappeenranta', lat: 61.0587, lng: 28.1887 },
  { name: 'Hämeenlinna', lat: 60.9959, lng: 24.464 },
  { name: 'Vaasa', lat: 63.0951, lng: 21.6165 },
  { name: 'Rovaniemi', lat: 66.5039, lng: 25.7294 },
  { name: 'Seinäjoki', lat: 62.7868, lng: 22.8403 },
  { name: 'Mikkeli', lat: 61.6887, lng: 27.2726 },
  { name: 'Kotka', lat: 60.4669, lng: 26.9458 },
  { name: 'Kouvola', lat: 60.8679, lng: 26.7042 },
  { name: 'Hyvinkää', lat: 60.6304, lng: 24.8597 },
  { name: 'Järvenpää', lat: 60.4734, lng: 25.0864 },
  { name: 'Porvoo', lat: 60.3924, lng: 25.6644 },
  { name: 'Lohja', lat: 60.249, lng: 24.065 },
  { name: 'Rauma', lat: 61.1279, lng: 21.5115 },
];

export function getCityCoords(
  city: string,
): { lat: number; lng: number } | null {
  const match = CITIES.find((c) => c.name.toLowerCase() === city.toLowerCase());
  return match ? { lat: match.lat, lng: match.lng } : null;
}
