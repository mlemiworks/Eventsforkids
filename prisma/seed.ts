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

function daysFromNow(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

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
      date: daysFromNow(3),
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
      date: daysFromNow(7),
      time: '14:00 - 15:00',
      age: '2–6 v',
      price: '0',
      imgUrl: '/testImages/reading.jpg',
      lat: 60.2038,
      lng: 24.6588,
    },
    {
      title: 'Lasten teatteriesitys: Tuhkimo',
      description:
        'Värikäs teatteriesitys koko perheelle. Tuhkimon tarina tulee eloon upeilla puvuilla ja huikeilla lavasteilla — rohkaisee jokaista lasta uskomaan itseensä.',
      category: 'teatteri',
      city: 'Tampere',
      location: 'Tampereen Teatteri',
      date: daysFromNow(10),
      time: '13:00 - 14:30',
      age: '4–10 v',
      price: '15',
      imgUrl: '/testImages/rangers.jpg',
      lat: 61.4981,
      lng: 23.7619,
    },
    {
      title: 'Perhekonsertti: Eläinten karnevaalit',
      description:
        'Saint-Saënsin Eläinten karnevaali esitettynä nuorisoorkesterin voimin. Konserttiin sisältyy hauskoja tehtäviä lapsille ja esittely eri soittimiin.',
      category: 'musiikki',
      city: 'Helsinki',
      location: 'Musiikkitalo',
      date: daysFromNow(14),
      time: '14:00 - 15:30',
      age: '2–8 v',
      price: '12',
      imgUrl: 'music',
      lat: 60.1733,
      lng: 24.9314,
    },
    {
      title: 'Pienten sirkuskoulu',
      description:
        'Opi jongleeraamista, akrobatiaa ja tasapainoilua ammattisirkustaiteilijoiden opastuksella. Kaikki tasot tervetulleita — ei aiempaa kokemusta tarvita.',
      category: 'sirkus',
      city: 'Vantaa',
      location: 'Sirkus Magenta',
      date: daysFromNow(20),
      time: '10:00 - 12:00',
      age: '6–14 v',
      price: '0',
      imgUrl: 'sirkus',
      lat: 60.2108,
      lng: 25.0822,
    },
    {
      title: 'Luontoretkikerho: Kevään merkit',
      description:
        'Tutkitaan yhdessä kevään luontoa, tunnistetaan lintuja ja kasveja sekä rakennetaan hyönteishotelli. Mukaan tarvitaan säälle sopivat vaatteet.',
      category: 'luonto',
      city: 'Espoo',
      location: 'Nuuksion kansallispuisto, pääsisäänkäynti',
      date: daysFromNow(28),
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
      date: daysFromNow(36),
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
      date: daysFromNow(45),
      time: '10:00 - 12:00',
      age: '5–10 v',
      price: '0',
      imgUrl: 'liikunta',
      lat: 65.0189,
      lng: 25.4824,
    },
    {
      title: 'Perhepyöräily: Kaupunkiseikkailu',
      description:
        'Yhteinen pyöräilyretki Jyväskylän puistoissa ja puistoteillä. Reitti on helppokulkuinen ja sopii pienten lasten kanssa — tasapyörät ovat tervetulleita.',
      category: 'liikunta',
      city: 'Jyväskylä',
      location: 'Kauppakatu 1 (kokoontumispiste)',
      date: daysFromNow(60),
      time: '11:00 - 13:00',
      age: '4–12 v',
      price: '0',
      imgUrl: 'liikunta',
      lat: 62.2382,
      lng: 25.7384,
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
