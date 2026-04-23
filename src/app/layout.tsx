// Metadata is a Next.js type for setting <head> tags (title, description, etc.)
// Exporting it from a layout or page file is how Next.js picks it up automatically.
import type { Metadata } from 'next';
// next/font/google downloads the font at build time and serves it from your own
// domain — no browser request to Google at runtime, better privacy and performance.
import { Fraunces, Nunito } from 'next/font/google';
import './globals.css';
import Footer from '../components/footer';
import Header from '../components/header';
import Providers from '../components/providers';

// `variable` maps the loaded font to a CSS custom property name.
// globals.css already references var(--font-display) and var(--font-sans),
// so we use those exact names here so the two halves connect automatically.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  // weights used in the design: regular body, semibold subheads, bold display
  weight: ['400', '600', '700'],
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-sans',
  // 500 (medium) is used for UI labels, 600 for nav/buttons, 700 for emphasis
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lasten tapahtumat',
  description: 'Kaikille lapsille sopivat tapahtumat yhdestä paikasta.',
};

// RootLayout wraps every page in the app — Next.js requires exactly one at the
// root of the app directory. Providers is here (not in a specific page) so that
// any component in the tree can call useSession() to read the auth state.
// Readonly<{ children: React.ReactNode }> is TypeScript saying the props object
// is immutable and children can be anything React can render.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Spreading both font variables onto <html> makes them available to the
    // entire document. globals.css then picks them up via var(--font-display)
    // and var(--font-sans) — no other wiring needed.
    <html lang="fi" className={`${fraunces.variable} ${nunito.variable}`}>
      <body>
        <Providers>
          <Header />
          {/* bg-bg references --color-bg from globals.css via Tailwind's @theme inline */}
          <main className="min-h-screen flex flex-col bg-bg">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
