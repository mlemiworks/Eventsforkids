const base =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink ' +
  'focus:outline-none focus:border-primary';

// children carries the <option> elements the caller provides
export function Select({
  className = '',
  children,
  ...rest
}: React.SelectHTMLAttributes<HTMLSelectElement> & { className?: string }) {
  return (
    <select className={`${base} ${className}`} {...rest}>
      {children}
    </select>
  );
}
