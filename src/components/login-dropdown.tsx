'use client';
import { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

type Props = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  message?: string;
};

export default function LoginDropdown({ open, onToggle, onClose, message }: Props) {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when the user clicks anywhere outside the container div.
  // We attach the listener only while the dropdown is open to avoid unnecessary work.
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) {
      setError('Väärä sähköposti tai salasana');
    } else {
      onClose();
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
    <div className="relative" ref={containerRef}>
      <button
        onClick={onToggle}
        className="text-gray-700 dark:text-gray-300 hover:underline"
      >
        Kirjaudu
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg p-4 w-64 z-10">
          {message && (
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
              {message}
            </p>
          )}
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
