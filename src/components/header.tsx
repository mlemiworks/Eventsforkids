'use client';
// Header must be a client component so it can read auth status (useSession),
// watch the current path (usePathname), and manage dropdown state (useState).
import { useState } from 'react';
import Link from 'next/link';
// usePathname is a Next.js hook that returns the current URL path so we can
// highlight the active nav link without any extra state.
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoginDropdown from './login-dropdown';

// NAV drives the link list. authRequired: true means the link shows for everyone
// but redirects unauthenticated users to the login dropdown instead of navigating.
const NAV = [
  { href: '/',             label: 'Etusivu',       authRequired: false },
  { href: '/create-event', label: 'Luo tapahtuma', authRequired: true  },
  { href: '/dashboard',    label: 'Omat',          authRequired: true  },
];

export default function Header() {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  // Simple email-based admin check — a proper role field on User would be cleaner
  // but this is enough until the admin route is built out.
  const isAdmin = session?.user?.email === 'admin@example.fi';

  const handleToggleLogin = () => {
    // Clear any triggered message when the user opens the dropdown manually
    setLoginMessage('');
    setLoginOpen((v) => !v);
  };

  const handleCloseLogin = () => {
    setLoginOpen(false);
    setLoginMessage('');
  };

  return (
    <header className="w-full bg-primary border-b border-primary-ink/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* font-display applies Fraunces via the CSS var set in layout.tsx */}
        <Link href="/" className="font-display text-2xl font-bold text-primary-ink">
          Lasten tapahtumat
        </Link>

        <nav className="flex items-center gap-2">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const requiresAuth = item.authRequired && status !== 'authenticated';

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  // Block navigation for auth-required items when not logged in,
                  // then open the dropdown with an explanatory message instead.
                  if (requiresAuth) {
                    e.preventDefault();
                    setLoginMessage('Kirjaudu sisään jatkaaksesi.');
                    setLoginOpen(true);
                  }
                }}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-primary-ink text-primary'
                    : 'text-primary-ink hover:bg-primary-ink/10'
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Admin link is only rendered when the session email matches */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                pathname === '/admin'
                  ? 'bg-primary-ink text-primary'
                  : 'text-primary-ink hover:bg-primary-ink/10'
              }`}
            >
              Hallinta
            </Link>
          )}

          {/* open/onToggle/onClose are lifted here so auth-gated nav links
              can open the dropdown from outside the LoginDropdown component itself */}
          <LoginDropdown
            open={loginOpen}
            onToggle={handleToggleLogin}
            onClose={handleCloseLogin}
            message={loginMessage}
          />
        </nav>
      </div>
    </header>
  );
}
