'use client';
import { useState, useRef, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

// open/onToggle/onClose are controlled by Header so that auth-gated nav links
// can open this dropdown from outside the component.
type Props = {
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
  message?: string; // optional prompt shown when triggered by a protected nav link
  fullWidth?: boolean; // true in the mobile menu so the button fills the row like other nav items
};

export default function LoginDropdown({
  open,
  onToggle,
  onClose,
  message,
  fullWidth = false,
}: Props) {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when the user clicks outside the container.
  // The effect is registered only while open to avoid pointless listeners.
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // redirect: false prevents NextAuth from doing a full page redirect on
    // success — we handle the result ourselves and close the dropdown instead.
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
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
      <div className={`flex items-center gap-3${fullWidth ? ' w-full justify-between' : ''}`}>
        <span className="text-sm text-primary-ink/70 font-medium">
          {session.user?.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ redirect: false })}
          // text-primary-ink so it stays legible on the green header background
          className="text-primary-ink hover:bg-primary-ink/10"
        >
          Kirjaudu ulos
        </Button>
      </div>
    );
  }

  return (
    // ref covers both the trigger button and the panel so clicks on either
    // side don't fire the outside-click handler
    <div className={`relative${fullWidth ? ' w-full' : ''}`} ref={containerRef}>
      {/* Custom button instead of the generic Button component — needs a specific
          blue pill shape that doesn't match any existing variant */}
      <button
        onClick={onToggle}
        className={`px-3.5 py-2 rounded-[18px] text-[15px] font-bold cursor-pointer border border-[rgb(158,197,232)] bg-[rgb(158,197,232)] text-[rgb(15,48,80)] transition-transform hover:brightness-105${fullWidth ? ' w-full' : ''}`}
      >
        Kirjaudu
      </button>

      {open && (
        <div className="absolute right-0 top-10 bg-surface border border-border rounded-xl shadow-(--shadow-card-hover) p-5 w-72 z-50">
          {message && (
            <p className="text-sm text-ink mb-4 pb-4 border-b border-border">
              {message}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <Input
              type="email"
              placeholder="Sähköposti"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Salasana"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-red-600 text-xs">{error}</p>}
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full"
            >
              Kirjaudu sisään
            </Button>
          </form>

          <p className="mt-4 text-xs text-ink-soft">
            Ei tiliä?{' '}
            <a href="/register" className="text-ink underline hover:opacity-70">
              Rekisteröidy
            </a>
          </p>
        </div>
      )}
    </div>
  );
}
