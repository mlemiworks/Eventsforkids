export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imgUrl: string;
}

export interface User {
  id: number;
  email: string;
  passwordHash: string;
}
