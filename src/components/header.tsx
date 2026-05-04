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
  {
    href: '/',
    label: 'Etusivu',
    authRequired: false,
    authOnly: false,
    variant: 'default',
  },
  {
    href: '/create-event',
    label: 'Luo tapahtuma',
    authRequired: true,
    authOnly: false,
    variant: 'create',
  },
  // Omat is hidden from guests — showing it to unauthenticated users would be confusing
  {
    href: '/dashboard',
    label: 'Omat',
    authRequired: true,
    authOnly: true,
    variant: 'auth',
  },
];

// Shared base classes for all nav links: pill shape, consistent padding and font size
const LINK_BASE =
  'px-[18px] py-[9px] rounded-full text-[15px] font-bold transition-colors';

// Returns the full className for a nav link based on its variant and active state.
// Any active link gets a solid white background regardless of variant.
function getLinkClass(
  variant: NavItem['variant'],
  active: boolean,
  fullWidth = false,
): string {
  const width = fullWidth ? ' w-full text-center block' : '';
  if (active) return `${LINK_BASE} bg-white text-[rgb(29,42,34)]${width}`;
  if (variant === 'create') {
    // Salmon/orange for "Luo tapahtuma" — visually separates it as a call-to-action
    return `${LINK_BASE} bg-[rgb(232,159,122)] text-[rgb(26,58,36)]${width}`;
  }
  // 'default' and 'auth' variants: translucent white blends with the green header
  return `${LINK_BASE} bg-[rgba(255,255,255,0.35)] text-[rgb(26,58,36)]${width}`;
}

export default function Header() {
  const { status, data: session } = useSession();
  const pathname = usePathname();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const closeMobile = () => setMobileOpen(false);

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

        {/* Desktop nav — hidden below the md breakpoint */}
        <nav className="hidden md:flex items-center gap-5">
          {NAV.map((item) => {
            if (item.authOnly && status !== 'authenticated') return null;
            const active = pathname === item.href;
            const requiresAuth =
              item.authRequired && status !== 'authenticated';
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
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

        {/* Hamburger button — visible only below the md breakpoint.
            The three bars animate into an X when the menu is open. */}
        <button
          className="md:hidden flex flex-col justify-center gap-1.25 w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.35)] px-2.5"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Sulje valikko' : 'Avaa valikko'}
          aria-expanded={mobileOpen}
        >
          {/* Each span is one bar. On open: top rotates +45°, middle fades, bottom rotates −45°.
              translate-y values are the distance between bar centers (1px + 5px gap + 1px = 7px). */}
          <span
            className={`block h-0.5 w-full bg-[rgb(26,58,36)] transition-transform origin-center duration-200 ${mobileOpen ? 'rotate-45 translate-y-1.75' : ''}`}
          />
          <span
            className={`block h-0.5 w-full bg-[rgb(26,58,36)] transition-opacity duration-200 ${mobileOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-full bg-[rgb(26,58,36)] transition-transform origin-center duration-200 ${mobileOpen ? '-rotate-45 -translate-y-1.75' : ''}`}
          />
        </button>
      </div>

      {/* Mobile menu panel — slides in below the header bar when hamburger is open.
          Only rendered in the DOM when open, so it collapses fully when closed. */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-primary-ink/10 px-6 py-4 flex flex-col gap-3">
          {NAV.map((item) => {
            if (item.authOnly && status !== 'authenticated') return null;
            const active = pathname === item.href;
            const requiresAuth =
              item.authRequired && status !== 'authenticated';
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  if (requiresAuth) {
                    e.preventDefault();
                    setLoginMessage('Kirjaudu sisään jatkaaksesi.');
                    setLoginOpen(true);
                  }
                  closeMobile();
                }}
                className={getLinkClass(item.variant, active, true)}
              >
                {item.label}
              </Link>
            );
          })}

          {isAdmin && (
            <Link
              href="/admin"
              onClick={closeMobile}
              className={getLinkClass('auth', pathname === '/admin', true)}
            >
              Hallinta
            </Link>
          )}

          <div className="mt-1">
            <LoginDropdown
              open={loginOpen}
              onToggle={handleToggleLogin}
              onClose={handleCloseLogin}
              message={loginMessage}
              fullWidth
            />
          </div>
        </nav>
      )}
    </header>
  );
}
