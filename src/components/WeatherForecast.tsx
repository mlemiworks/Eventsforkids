'use client';

import { useEffect, useState } from 'react';
import { getCityCoords } from '@/src/lib/categories';

// Maps WMO weather interpretation codes to an emoji icon
function getWeatherIcon(code: number): string {
  if (code === 0) return '☀️';
  if (code <= 3) return '🌤️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 67) return '🌧️';
  if (code >= 71 && code <= 77) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code >= 95) return '⛈️';
  return '🌤️';
}

type WeatherData = {
  tempMax: number;
  tempMin: number;
  precipProbability: number;
  weatherCode: number;
};

export default function WeatherForecast({
  city,
  date,
}: {
  city: string;
  date: string; // YYYY-MM-DD
}) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const coords = getCityCoords(city);
    console.log(coords);
    if (!coords) {
      console.log(coords);
      setLoading(false);
      return;
    }

    const { lat, lng } = coords;
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lng}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode` +
      `&timezone=Europe%2FHelsinki` +
      `&start_date=${date}&end_date=${date}`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const d = data.daily;
        if (!d || !d.temperature_2m_max?.[0]) return;
        setWeather({
          tempMax: Math.round(d.temperature_2m_max[0]),
          tempMin: Math.round(d.temperature_2m_min[0]),
          precipProbability: d.precipitation_probability_max[0] ?? 0,
          weatherCode: d.weathercode[0] ?? 0,
        });
      })
      .catch(() => {
        // weather is a nice-to-have — silently fail
      })
      .finally(() => setLoading(false));
  }, [city, date]);

  if (loading) {
    return (
      <div className="bg-surface rounded-card border border-border shadow-(--shadow-card) p-6">
        <p className="text-xs text-ink-soft uppercase tracking-wide font-semibold mb-3">
          Sääennuste tapahtumapäivänä
        </p>
        <div className="animate-pulse flex gap-4 items-center">
          <div className="w-10 h-10 bg-surface-soft rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-surface-soft rounded w-24" />
            <div className="h-3 bg-surface-soft rounded w-16" />
          </div>
        </div>
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="bg-surface rounded-card border border-border shadow-(--shadow-card) p-6">
      <p className="text-xs text-ink-soft uppercase tracking-wide font-semibold mb-3">
        Sääennuste tapahtumapäivänä
      </p>
      <div className="flex items-center gap-4">
        <span className="text-4xl" role="img" aria-label="weather icon">
          {getWeatherIcon(weather.weatherCode)}
        </span>
        <div>
          <p className="text-lg font-bold text-ink">
            {weather.tempMax}° / {weather.tempMin}°
          </p>
          <p className="text-sm text-ink-soft">
            Sade {weather.precipProbability}%
          </p>
        </div>
      </div>
    </div>
  );
}
