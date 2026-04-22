import { Event, User } from '../types/types';
import { readFile } from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'public', 'db.json');

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
  return events.find((e) => e.id === id) ?? null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const db = await readDb();
  return db.users.find((u) => u.email === email) ?? null;
};
