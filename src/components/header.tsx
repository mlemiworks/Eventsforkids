'use client';
// Header must be a client component so it can read auth status (useSession)
// and manage the login dropdown's open state (useState).
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import LoginDropdown from './login-dropdown';

const Header = () => {
  const { status } = useSession();
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const handleCreateEventClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Block navigation and open the login dropdown with a prompt instead,
    // so unauthenticated users know why they can't access the page
    if (status !== 'authenticated') {
      e.preventDefault();
      setLoginMessage('Kirjaudu sisään luodaksesi tapahtuma.');
      setLoginOpen(true);
    }
  };

  const handleToggleLogin = () => {
    // Clear any prompt message when the user manually opens the dropdown —
    // the message only makes sense when triggered by "Luo tapahtuma"
    setLoginMessage('');
    setLoginOpen((v) => !v);
  };

  const handleCloseLogin = () => {
    setLoginOpen(false);
    setLoginMessage('');
  };

  return (
    <header className="w-full bg-white dark:bg-black py-4 mb-20 border-b border-gray-200 dark:border-gray-700">
      <div className="w-auto mx-10 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Lasten tapahtumat
        </h1>
        <nav>
          <ul className="flex items-center space-x-10">
            <li>
              <a href="/" className="text-gray-700 dark:text-gray-300 hover:underline">
                Etusivu
              </a>
            </li>
            <li>
              <a
                href="/create-event"
                onClick={handleCreateEventClick}
                className="text-gray-700 dark:text-gray-300 hover:underline"
              >
                Luo tapahtuma
              </a>
            </li>
            <li>
              <a href="#" className="text-gray-700 dark:text-gray-300 hover:underline">
                Yhteystiedot
              </a>
            </li>
            <li>
              {/* open/onToggle/onClose are lifted up here so that clicking
                  "Luo tapahtuma" can open the dropdown from outside it */}
              <LoginDropdown
                open={loginOpen}
                onToggle={handleToggleLogin}
                onClose={handleCloseLogin}
                message={loginMessage}
              />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
