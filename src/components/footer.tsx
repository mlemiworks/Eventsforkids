const Footer = () => {
  return (
    <footer className="w-full bg-primary text-primary-ink px-8 py-8">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-6">
        <div className="text-sm leading-relaxed">
          <div className="font-display italic font-bold text-lg">
            Lasten Tapahtumat
          </div>
          <div className="opacity-80 mt-1">
            &copy; {new Date().getFullYear()} Kaikki oikeudet pidätetään.
          </div>
        </div>
        <div className="text-sm leading-relaxed">
          <div className="font-bold mb-1">Yhteystiedot</div>
          <div className="opacity-90">Sähköposti: hei@lastentapahtumat.fi</div>
          <div className="opacity-90">Instagram @lastentapahtumat</div>
        </div>
        {/* Privacy notice — brief disclosure of what data is stored, why, and for how long */}
        <div className="text-sm leading-relaxed max-w-sm opacity-80">
          <div className="font-bold mb-1">Tietosuoja</div>
          <p>
            Rekisteröityessäsi tallennamme sähköpostiosoitteesi ja salatun
            salasanasi tunnistautumista varten sekä luomasi tapahtumat. Tietoja
            ei luovuteta kolmansille osapuolille. Säilytämme tietojasi niin
            kauan kuin tilisi on aktiivinen — voit pyytää tietojesi poistamista
            milloin tahansa osoitteesta hei@lastentapahtumat.fi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
