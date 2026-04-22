'use client';
import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function LoginDropdown() {
  const { data: session, status } = useSession();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setError('Väärä sähköposti tai salasana');
    } else {
      setOpen(false);
      setEmail('');
      setPassword('');
    }
  };

  if (status === 'loading') return null;

  if (status === 'authenticated') {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {session.user?.email}
        </span>
        <button
          onClick={() => signOut({ redirect: false })}
          className="text-gray-700 dark:text-gray-300 hover:underline"
        >
          Kirjaudu ulos
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-700 dark:text-gray-300 hover:underline"
      >
        Kirjaudu
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg p-4 w-64 z-10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Sähköposti"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <input
              type="password"
              placeholder="Salasana"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <button
              type="submit"
              className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded px-3 py-1.5 text-sm hover:opacity-80"
            >
              Kirjaudu sisään
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Ei tiliä?{' '}
            <a href="/register" className="underline hover:opacity-70">
              Rekisteröidy
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
