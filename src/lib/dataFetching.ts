import { Event, User } from '../types/types';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';

// path.join + process.cwd() builds an absolute path that works regardless of
// where the Node process was started from. Files in public/ are readable by
// server-side Node code but are NOT served over HTTP by Next.js — only static
// assets (images, etc.) placed there intentionally are exposed to the browser.
const DB_PATH = path.join(process.cwd(), 'public', 'db.json');

// Private helper so every exported function reads from one place.
// : Promise<...> is TypeScript saying this async function returns a promise
// that resolves to an object with those two arrays.
async function readDb(): Promise<{ events: Event[]; users: User[] }> {
  const raw = await readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw) as { events: Event[]; users: User[] };
}

export const fetchEvents = async (): Promise<Event[]> => {
  const db = await readDb();
  return db.events;
};

export const fetchEventById = async (id: number): Promise<Event | null> => {
  const events = await fetchEvents();
  // ?? null converts undefined (what find() returns on no match) to an explicit
  // null, which is more predictable to check against in calling code
  return events.find((e) => e.id === id) ?? null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const db = await readDb();
  return db.users.find((u) => u.email === email) ?? null;
};

export const createUser = async (email: string, passwordHash: string): Promise<User> => {
  const db = await readDb();
  // Take one more than the current max so IDs stay unique even after deletions
  const id = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
  const newUser: User = { id, email, passwordHash };
  db.users.push(newUser);
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return newUser;
};

// Omit<Event, 'id'> is a TypeScript utility type meaning "the Event type but
// without the id field" — the caller doesn't supply an id, we generate it here.
export const createEvent = async (
  fields: Omit<Event, 'id'>,
): Promise<Event> => {
  const db = await readDb();
  const id = db.events.length > 0 ? Math.max(...db.events.map((e) => e.id)) + 1 : 1;
  const newEvent: Event = { id, ...fields };
  db.events.push(newEvent);
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return newEvent;
};

export const deleteEvent = async (id: number): Promise<boolean> => {
  const db = await readDb();
  const index = db.events.findIndex((e) => e.id === id);
  if (index === -1) return false;
  // splice mutates the array in place, removing exactly 1 element at `index`
  db.events.splice(index, 1);
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return true;
};

// Partial<Omit<Event, 'id' | 'createdBy'>> means "any subset of Event fields,
// but not id (immutable) or createdBy (ownership must not change on edit)".
export const updateEvent = async (
  id: number,
  fields: Partial<Omit<Event, 'id' | 'createdBy'>>,
): Promise<Event | null> => {
  const db = await readDb();
  const index = db.events.findIndex((e) => e.id === id);
  if (index === -1) return null;
  // Spread existing event first so any field not included in `fields` is preserved
  db.events[index] = { ...db.events[index], ...fields };
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return db.events[index];
};
