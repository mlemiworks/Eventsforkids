'use client';
import { useState } from 'react';
import type { Event } from '../types/types';
import { CATEGORIES, CITIES } from '../lib/categories';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Textarea } from './ui/Textarea';
import { Button } from './ui/Button';
import { IllustrationPicker } from './ui/Illustrations';

// All form values are kept as strings because HTML inputs always return strings.
// The caller's onSubmit receives this shape and converts price → number before the API call.
export type FormFields = {
  title: string;
  category: string;
  city: string;
  date: string;
  time: string;
  price: string; // empty string = not set; "0" = free
  age: string;
  location: string;
  description: string;
  imgUrl: string;
};

const EMPTY: FormFields = {
  title: '',
  category: '',
  city: '',
  date: '',
  time: '',
  price: '',
  age: '',
  location: '',
  description: '',
  imgUrl: '',
};

// Converts an existing Event to the string-based FormFields shape for pre-filling the edit form.
export function eventToFormFields(event: Event): FormFields {
  return {
    title: event.title,
    category: event.category ?? '',
    city: event.city ?? '',
    date: event.date,
    time: event.time,
    price: event.price != null ? String(event.price) : '',
    age: event.age ?? '',
    location: event.location,
    description: event.description,
    imgUrl: event.imgUrl,
  };
}

export default function EventForm({
  initial,
  onSubmit,
  submitLabel = 'Tallenna',
}: {
  initial?: Partial<FormFields>;
  // The caller handles the actual API call; throwing with an Error message displays it below the form.
  onSubmit: (fields: FormFields) => Promise<void>;
  submitLabel?: string;
}) {
  const [fields, setFields] = useState<FormFields>({ ...EMPTY, ...initial });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Generic field updater — avoids a separate useState + handler for every field.
  // The union event type is intentionally wide so it's compatible with Input,
  // Select, and Textarea without needing three separate helpers.
  const set =
    (key: keyof FormFields) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(fields);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Jokin meni pieleen. Yritä uudelleen.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {/* Title — full width */}
      <Field label="Otsikko" required>
        <Input
          value={fields.title}
          onChange={set('title')}
          required
          placeholder="Tapahtuman nimi"
        />
      </Field>

      {/* Category + city — two columns */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Kategoria">
          <Select value={fields.category} onChange={set('category')}>
            <option value="">Valitse kategoria</option>
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Kaupunki">
          <Select value={fields.city} onChange={set('city')}>
            <option value="">Valitse kaupunki</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {/* Date + time + price — three columns */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Päivämäärä" required>
          <Input
            type="date"
            value={fields.date}
            onChange={set('date')}
            required
          />
        </Field>
        <Field label="Kellonaika">
          <Input
            value={fields.time}
            onChange={set('time')}
            placeholder="10:00 – 12:00"
          />
        </Field>
        <Field label="Hinta (€)">
          <Input
            type="number"
            value={fields.price}
            onChange={set('price')}
            min="0"
            step="0.5"
            placeholder="0 = ilmainen"
          />
        </Field>
      </div>

      {/* Age recommendation — full width */}
      <Field label="Ikäsuositus">
        <Input
          value={fields.age}
          onChange={set('age')}
          placeholder="esim. 3–8 v"
        />
      </Field>

      {/* Venue name — full width */}
      <Field label="Tapahtumapaikka">
        <Input
          value={fields.location}
          onChange={set('location')}
          placeholder="esim. Kulttuurikeskus Stoa"
        />
      </Field>

      {/* Description — full width */}
      <Field label="Kuvaus">
        <Textarea
          rows={4}
          value={fields.description}
          onChange={set('description')}
          placeholder="Kerro tapahtumasta..."
        />
      </Field>

      <Field label="Valitse kuvitus">
        <IllustrationPicker
          value={fields.imgUrl}
          // setFields directly — avoids constructing a fake React.ChangeEvent
          // that `set()` would expect but TypeScript would reject.
          onChange={(val) => setFields((prev) => ({ ...prev, imgUrl: val }))}
        />
      </Field>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="w-full mt-2"
      >
        {loading ? 'Tallennetaan...' : submitLabel}
      </Button>
    </form>
  );
}

// Label + optional hint wrapper — used only inside this file
function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-ink">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}
