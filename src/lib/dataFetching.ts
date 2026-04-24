// This is the single place in the app that talks to the database.
// All other files import from here — none of them use Prisma directly.
// Swapping the database later only requires changing this file.
import prisma from './prisma';

// Re-export the Prisma-generated types so the rest of the app can import
// Event and User from here, just like they did before.
// 'export type' is TypeScript syntax — it makes clear we're only exporting
// a type definition, not a runtime value.
export type { Event, User } from '../generated/prisma';

// Fetch all events, newest first
export const fetchEvents = async () => {
  return prisma.event.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

// Fetch a single event by its ID. Returns null if not found.
// Note: id is now a string (cuid), not a number.
export const fetchEventById = async (id: string) => {
  return prisma.event.findUnique({
    where: { id },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

// createUser now takes email and password hash as separate arguments,
// matching how the register route calls it.
export const createUser = async (email: string, password: string) => {
  return prisma.user.create({
    data: { email, password },
  });
};

// Omit the auto-generated fields — the caller supplies everything else.
// The Prisma-generated Event type includes id and createdAt which we exclude here.
export const createEvent = async (fields: {
  title: string;
  date: string;
  time?: string | null;
  location: string;
  city: string;
  category: string;
  imgUrl: string;
  age?: string | null;
  description?: string | null;
  price?: string | null;
  createdBy?: string | null;
}) => {
  return prisma.event.create({ data: fields });
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    await prisma.event.delete({ where: { id } });
    return true;
  } catch {
    // Prisma throws if the record doesn't exist — we catch and return false
    // to match the original function's behaviour
    return false;
  }
};

export const updateEvent = async (
  id: string,
  // Partial means all fields are optional — only send what changed
  fields: Partial<{
    title: string;
    date: string;
    time: string | null;
    location: string;
    description: string | null;
    imgUrl: string;
    category: string;
    city: string;
    age: string | null;
    price: string | null;
  }>,
) => {
  try {
    return await prisma.event.update({
      where: { id },
      data: fields,
    });
  } catch {
    // Prisma throws P2025 if record not found — return null to match original
    return null;
  }
};
