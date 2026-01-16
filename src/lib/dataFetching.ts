import { Event } from '../types/types';

// simulate fetching data but actually just return json data from db.json
export const fetchEvents = async (): Promise<Event[]> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Fetch data from local db.json file
  const response = await fetch('http://localhost:3000/db.json');
  const data = await response.json();
  return data;
};

// simulate fetching a single event by id
export const fetchEventById = async (id: number): Promise<Event | null> => {
  const events = await fetchEvents();
  const event = events.find((e) => e.id === id) || null;
  return event;
};
