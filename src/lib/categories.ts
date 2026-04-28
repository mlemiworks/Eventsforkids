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
    name: 'Sirkus',
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
  'Helsinki',
  'Espoo',
  'Tampere',
  'Vantaa',
  'Oulu',
  'Turku',
  'Jyväskylä',
  'Lahti',
  'Kuopio',
  'Pori',
  'Joensuu',
  'Lappeenranta',
  'Hämeenlinna',
  'Vaasa',
  'Rovaniemi',
  'Seinäjoki',
  'Mikkeli',
  'Kotka',
  'Kouvola',
  'Hyvinkää',
  'Järvenpää',
  'Porvoo',
  'Lohja',
  'Rauma',
];
