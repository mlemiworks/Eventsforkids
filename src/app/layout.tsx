// Metadata is a Next.js type for setting <head> tags (title, description, etc.)
// Exporting it from a layout or page file is how Next.js picks it up automatically.
import type { Metadata } from 'next';
import './globals.css';
import Footer from '../components/footer';
import Header from '../components/header';
import Providers from '../components/providers';

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
    <html lang="en" className="bg-white dark:bg-black">
      <body>
        <Providers>
          <Header />
          <main className="min-h-screen flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
