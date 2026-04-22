// TypeScript interfaces define the shape of objects — like a contract that every
// event or user object in the app must follow. The compiler will error if any
// code produces or expects a different shape.

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imgUrl: string;
  createdBy?: string; // optional (?) because the 3 seeded events predate the auth system
}

export interface User {
  id: number;
  email: string;
  passwordHash: string; // we never store the plain-text password, only the bcrypt hash
}
