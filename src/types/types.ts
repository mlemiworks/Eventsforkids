// TypeScript interfaces define the shape of objects — like a contract that every
// event or user object in the app must follow. The compiler will error if any
// code produces or expects a different shape.

// The allowed category values as a union type — this is TypeScript's way of
// saying "one of these exact strings, nothing else". Using a named type lets
// us reuse it in forms, filters, and API validation without duplicating the list.
// 'sirkus' replaces 'kädentaidot' to match the prototype's category set and
// the --color-cat-* tokens in globals.css
export type Category =
  | 'musiikki'
  | 'liikunta'
  | 'taide'
  | 'teatteri'
  | 'sirkus'
  | 'luonto'
  | 'muu';

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string; // the venue name — displayed with label "Paikka" in the UI
  city?: string; // optional until the DB migration adds the column
  category?: Category; // optional — not all existing events have one
  age?: string; // free-form age recommendation, e.g. "3–8 v"
  price?: number; // in euros; 0 means free; omitted means price unknown
  imgUrl: string;
  createdBy?: string; // optional because the 3 seeded events predate the auth system
}

export interface User {
  id: number;
  email: string;
  passwordHash: string; // we never store the plain-text password, only the bcrypt hash
}
