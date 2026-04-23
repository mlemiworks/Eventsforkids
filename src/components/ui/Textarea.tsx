const base =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink ' +
  'placeholder:text-ink-soft focus:outline-none focus:border-primary resize-none';

export function Textarea({
  className = '',
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
  return <textarea className={`${base} ${className}`} {...rest} />;
}
