// Variant and Size are union types — TypeScript's way of restricting a value
// to a fixed set of strings. The compiler will error if you pass e.g. variant="orange".
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

// Record<K, V> is a TypeScript utility type meaning "an object whose keys are K
// and whose values are V". Here it guarantees every variant and size has a class string.
const variants: Record<Variant, string> = {
  primary:   'bg-primary text-primary-ink hover:brightness-95',
  secondary: 'bg-surface-soft text-ink hover:bg-border',
  ghost:     'text-ink hover:bg-surface-soft',
  danger:    'bg-red-100 text-red-900 hover:bg-red-200',
};

const sizes: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-base font-semibold',
};

// React.ButtonHTMLAttributes<HTMLButtonElement> passes through all standard button
// props (onClick, disabled, type, etc.) so callers don't have to re-declare them.
// The & adds our custom variant/size props on top.
export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
}) {
  return (
    <button
      className={`rounded-full font-semibold transition-colors disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}
