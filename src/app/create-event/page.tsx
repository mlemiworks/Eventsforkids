'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/create-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, time, location, description, imgUrl }),
      });
      const data = (await res.json()) as { id?: number; error?: string };
      if (!res.ok) {
        setError(data.error ?? 'Tapahtuman luonti epäonnistui');
      } else {
        router.push(`/${data.id}`);
      }
    } catch {
      setError('Jokin meni pieleen. Yritä uudelleen.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center py-16 px-4">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Luo tapahtuma
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-sm text-gray-700 dark:text-gray-300">
              Otsikko <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="date" className="text-sm text-gray-700 dark:text-gray-300">
              Päivämäärä <span className="text-red-500">*</span>
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="time" className="text-sm text-gray-700 dark:text-gray-300">
              Kellonaika
            </label>
            <input
              id="time"
              type="text"
              placeholder="esim. 10:00 - 12:00"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="location" className="text-sm text-gray-700 dark:text-gray-300">
              Sijainti
            </label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="text-sm text-gray-700 dark:text-gray-300">
              Kuvaus
            </label>
            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="imgUrl" className="text-sm text-gray-700 dark:text-gray-300">
              Kuvan URL
            </label>
            <input
              id="imgUrl"
              type="url"
              placeholder="https://placehold.co/600x400"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Jätä tyhjäksi käyttääksesi oletuskuvaa.
            </p>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded px-4 py-2 hover:opacity-80 disabled:opacity-50"
          >
            {loading ? 'Luodaan...' : 'Luo tapahtuma'}
          </button>
        </form>
      </div>
    </div>
  );
}
