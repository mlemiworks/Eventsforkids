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
        {/* Privacy notice — portfolio demo version: all data is wiped automatically every 6 hours */}
        <div className="text-sm leading-relaxed max-w-sm opacity-80">
          <div className="font-bold mb-1">Tietosuoja</div>
          <p>
            Tämä on portfoliodemosivusto. Rekisteröityessäsi tallennamme
            sähköpostiosoitteesi, salatun salasanasi ja luomasi tapahtumat
            ainoastaan demon toimivuuden osoittamiseksi. Kaikki tiedot
            poistetaan automaattisesti kuuden tunnin välein. Tietoja ei
            luovuteta kolmansille osapuolille.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
