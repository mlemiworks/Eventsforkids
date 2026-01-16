const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-black">
      &copy; {new Date().getFullYear()} Lasten tapahtumat. Kaikki oikeudet
      pidätetään.
    </footer>
  );
};

export default Footer;
