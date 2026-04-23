// The base class is shared across Input, Select, and Textarea so every form field
// looks identical without copying the string into each file.
const base =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink ' +
  'placeholder:text-ink-soft focus:outline-none focus:border-primary';

// React.InputHTMLAttributes<HTMLInputElement> passes through all standard input
// attributes (type, name, value, onChange, required, disabled, …) so callers
// use this just like a plain <input> — no extra wiring needed.
export function Input({
  className = '',
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
  return <input className={`${base} ${className}`} {...rest} />;
}
