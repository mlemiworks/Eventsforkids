const Header = () => {
  return (
    <header className="w-full bg-white dark:bg-black py-4 mb-20 border-b border-gray-200 dark:border-gray-700">
      <div className="w-auto mx-10 px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Lasten tapahtumat
        </h1>
        <nav>
          <ul className="flex space-x-10">
            <li>
              <a
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:underline"
              >
                Etusivu
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:underline"
              >
                Luo tapahtuma
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-gray-700 dark:text-gray-300 hover:underline"
              >
                Yhteystiedot
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
