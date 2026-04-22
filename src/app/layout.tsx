import type { Metadata } from 'next';
import './globals.css';
import Footer from '../components/footer';
import Header from '../components/header';
import Providers from '../components/providers';

export const metadata: Metadata = {
  title: 'Lasten tapahtumat',
  description: 'Kaikille lapsille sopivat tapahtumat yhdestä paikasta.',
};

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
