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

// TypeScript type for NAV items.
// variant controls which color scheme the link uses.
// authOnly: true means the link is hidden entirely when not authenticated.
// authRequired: true means clicking opens the login dropdown when not authenticated.
type NavItem = {
  href: string;
  label: string;
  authRequired: boolean;
  authOnly: boolean;
  variant: 'default' | 'create' | 'auth';
};

const NAV: NavItem[] = [
  { href: '/',             label: 'Etusivu',       authRequired: false, authOnly: false, variant: 'default' },
  { href: '/create-event', label: 'Luo tapahtuma', authRequired: true,  authOnly: false, variant: 'create'  },
  // Omat is hidden from guests — showing it to unauthenticated users would be confusing
  { href: '/dashboard',    label: 'Omat',          authRequired: true,  authOnly: true,  variant: 'auth'    },
];

// Shared base classes for all nav links: pill shape, consistent padding and font size
const LINK_BASE = 'px-[18px] py-[9px] rounded-full text-[15px] font-bold transition-colors';

// Returns the full className for a nav link based on its variant and active state.
// Any active link gets a solid white background regardless of variant.
function getLinkClass(variant: NavItem['variant'], active: boolean): string {
  if (active) return `${LINK_BASE} bg-white text-[rgb(29,42,34)]`;
  if (variant === 'create') {
    // Salmon/orange for "Luo tapahtuma" — visually separates it as a call-to-action
    return `${LINK_BASE} bg-[rgb(232,159,122)] text-[rgb(26,58,36)]`;
  }
  // 'default' and 'auth' variants: translucent white blends with the green header
  return `${LINK_BASE} bg-[rgba(255,255,255,0.35)] text-[rgb(26,58,36)]`;
}

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

        {/* Logo: decorative badge + two-line italic wordmark */}
        <Link href="/" className="flex items-center gap-3">
          {/* Yellow circle with a smaller blue dot inside, tilted for a playful feel */}
          <div
            className="w-11 h-11 rounded-full bg-[rgb(242,199,92)] grid place-items-center shrink-0"
            style={{ transform: 'rotate(-8deg)' }}
          >
            <div className="w-5 h-5 rounded-full bg-[rgb(158,197,232)]" />
          </div>
          {/* Two-line wordmark: tight leading so the lines sit close together */}
          <div>
            <div
              className="font-display text-[26px] font-bold text-primary-ink leading-none italic"
              style={{ letterSpacing: '-0.5px' }}
            >
              Lasten
            </div>
            <div
              className="font-display text-[26px] font-bold text-primary-ink leading-none mt-0.5 italic"
              style={{ letterSpacing: '-0.5px' }}
            >
              Tapahtumat
            </div>
          </div>
        </Link>

        {/* gap-5 = 20px, which is 2.5× the original 8px (a 150% increase) */}
        <nav className="flex items-center gap-5">
          {NAV.map((item) => {
            // authOnly items are hidden entirely when the user is not logged in
            if (item.authOnly && status !== 'authenticated') return null;

            const active = pathname === item.href;
            const requiresAuth = item.authRequired && status !== 'authenticated';

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  // Block navigation for auth-required items when not logged in,
                  // then open the login dropdown with an explanatory message instead.
                  if (requiresAuth) {
                    e.preventDefault();
                    setLoginMessage('Kirjaudu sisään jatkaaksesi.');
                    setLoginOpen(true);
                  }
                }}
                className={getLinkClass(item.variant, active)}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Admin link is only rendered when the session email matches */}
          {isAdmin && (
            <Link
              href="/admin"
              className={getLinkClass('auth', pathname === '/admin')}
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
