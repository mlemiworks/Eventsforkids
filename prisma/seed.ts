// prisma/seed.ts
// This script populates the database with initial data.
// Run it with: npx prisma db seed
// It uses upsert (insert-or-update) so it's safe to run multiple times
// without creating duplicates.
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --- Users ---
  // We already have the bcrypt hashes from db.json so we can insert them directly.
  // No need to re-hash — the hash IS the password in stored form.
  await prisma.user.upsert({
    where: { email: 'testi@example.com' },
    update: {},
    create: {
      email: 'testi@example.com',
      password: '$2b$10$5ztgBy8iKkrUafrq3uOfc.YT/c/mwXlB6a42aCQWfHoada2/0z04W',
    },
  });

  await prisma.user.upsert({
    where: { email: 'admin@example.fi' },
    update: {},
    create: {
      email: 'admin@example.fi',
      password: '$2b$10$iOzjbMjfXDOkP8SWG6xWU.B7q2M209Ro8ZMMgVvm0p8pQcyn.LWve',
      name: 'tapahtumatAdmin',
    },
  });

  console.log('✓ Users seeded');

  // --- Events ---
  // price was a number in db.json but is a string in the new schema.
  // We convert it here: 0 → "0", 5 → "5", null/missing → null.
  // createdBy is only set on event 10 — the rest were seeded without an owner.
  const events = [
    {
      title: 'Lasten kasvomaalaus',
      description:
        'Ammattitaitoiset taiteilijat muuttavat lapsesi sankariksi, eläimeksi tai satuolennoksi. Värit ovat vesiliukoisia ja turvallisia herkälle iholle.',
      category: 'taide',
      city: 'Helsinki',
      location: 'Kasvomaalausverstas, Hakaniemi',
      date: '2026-03-15',
      time: '10:00 - 13:00',
      age: '3–10 v',
      price: '5',
      imgUrl: '/testImages/facepaint.jpg',
    },
    {
      title: 'Lukuhetki perheille: Sadut heräävät eloon',
      description:
        'Kokenut näyttelijä lukee ja esittää lastensatuja pienelle yleisölle. Tunnin mittainen esitys on sopiva myös kaikkein pienimmille.',
      category: 'teatteri',
      city: 'Espoo',
      location: 'Espoon pääkirjasto',
      date: '2026-04-05',
      time: '14:00 - 15:00',
      age: '2–6 v',
      price: '0',
      imgUrl: '/testImages/reading.jpg',
    },
    {
      title: 'Lasten teatteriesitys: Tuhkimo',
      description:
        'Värikäs teatteriesitys koko perheelle. Tuhkimon tarina tulee eloon upeilla puvuilla ja huikeilla lavasteilla — rohkaisee jokaista lasta uskomaan itseensä.',
      category: 'teatteri',
      city: 'Tampere',
      location: 'Tampereen Teatteri',
      date: '2026-04-17',
      time: '13:00 - 14:30',
      age: '4–10 v',
      price: '15',
      imgUrl: '/testImages/rangers.jpg',
    },
    {
      title: 'Perhekonsertti: Eläinten karnevaalit',
      description:
        'Saint-Saënsin Eläinten karnevaali esitettynä nuorisoorkesterin voimin. Konserttiin sisältyy hauskoja tehtäviä lapsille ja esittely eri soittimiin.',
      category: 'musiikki',
      city: 'Helsinki',
      location: 'Musiikkitalo',
      date: '2026-05-10',
      time: '14:00 - 15:30',
      age: '2–8 v',
      price: '12',
      imgUrl: 'music',
    },
    {
      title: 'Pienten sirkuskoulu',
      description:
        'Opi jongleeraamista, akrobatiaa ja tasapainoilua ammattisirkustaiteilijoiden opastuksella. Kaikki tasot tervetulleita — ei aiempaa kokemusta tarvita.',
      category: 'sirkus',
      city: 'Vantaa',
      location: 'Sirkus Magenta',
      date: '2026-05-17',
      time: '10:00 - 12:00',
      age: '6–14 v',
      price: '0',
      imgUrl: 'sirkus',
    },
    {
      title: 'Luontoretkikerho: Kevään merkit',
      description:
        'Tutkitaan yhdessä kevään luontoa, tunnistetaan lintuja ja kasveja sekä rakennetaan hyönteishotelli. Mukaan tarvitaan säälle sopivat vaatteet.',
      category: 'luonto',
      city: 'Espoo',
      location: 'Nuuksion kansallispuisto, pääsisäänkäynti',
      date: '2026-05-24',
      time: '10:00 - 13:00',
      age: '5–12 v',
      price: '0',
      imgUrl: 'luonto',
    },
    {
      title: 'Keramiikkatyöpaja lapsille',
      description:
        'Lapset saavat muovailla omia saviteoksia, jotka poltetaan ja lasitetaan. Kotiin pääsee ainutlaatuinen taideteos — muisto tekemisestä.',
      category: 'taide',
      city: 'Oulu',
      location: 'Oulun taidemuseo, työpajatila',
      date: '2026-06-07',
      time: '12:00 - 15:00',
      age: '7–12 v',
      price: '10',
      imgUrl: 'savi',
    },
    {
      title: 'Lasten yleisurheilukerho',
      description:
        'Hauska ja kannustava urheilukerho, jossa kokeilet juoksua, hyppäämistä ja heittämistä. Ohjaajat luovat turvallisen ja iloisen ilmapiirin.',
      category: 'liikunta',
      city: 'Turku',
      location: 'Paavo Nurmi -stadion',
      date: '2026-06-14',
      time: '10:00 - 12:00',
      age: '5–10 v',
      price: '0',
      imgUrl: 'liikunta',
    },
    {
      title: 'Perhepyöräily: Kaupunkiseikkailu',
      description:
        'Yhteinen pyöräilyretki Jyväskylän puistoissa ja puistoteillä. Reitti on helppokulkuinen ja sopii pienten lasten kanssa — tasapyörät ovat tervetulleita.',
      category: 'liikunta',
      city: 'Jyväskylä',
      location: 'Kauppakatu 1 (kokoontumispiste)',
      date: '2026-06-21',
      time: '11:00 - 13:00',
      age: '4–12 v',
      price: '0',
      imgUrl: 'liikunta',
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }

  console.log('✓ Events seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
