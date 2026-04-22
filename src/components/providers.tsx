'use client';
import { SessionProvider } from 'next-auth/react';

// SessionProvider must wrap the whole app so that any component can call
// useSession() to read the logged-in user. It uses React context internally,
// which only works on the client — hence 'use client'.
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
