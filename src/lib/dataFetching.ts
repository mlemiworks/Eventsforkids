import { Event, User } from '../types/types';
import { readFile, writeFile } from 'fs/promises';
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

export const createUser = async (email: string, passwordHash: string): Promise<User> => {
  const db = await readDb();
  const id = db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1;
  const newUser: User = { id, email, passwordHash };
  db.users.push(newUser);
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return newUser;
};

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
  db.events.splice(index, 1);
  await writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
  return true;
};
