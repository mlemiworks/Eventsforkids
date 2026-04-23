// Pill renders a small inline badge — used for age range, status, etc.
// Category pills are a special case: their colors come from the CATEGORIES lib
// so the caller passes them inline via the style prop rather than through tone.
export function Pill({
  children,
  tone = 'neutral',
  className = '',
  style,
}: {
  children: React.ReactNode;
  tone?: 'neutral' | 'primary' | 'category';
  className?: string;
  // React.CSSProperties is TypeScript's type for inline style objects
  style?: React.CSSProperties;
}) {
  const tones: Record<string, string> = {
    neutral:  'bg-surface-soft text-ink',
    primary:  'bg-primary text-primary-ink',
    // 'category' has no class — background/color are supplied via the style prop
    category: '',
  };

  return (
    <span
      className={`inline-flex items-center rounded-pill px-3 py-1 text-xs font-semibold ${tones[tone]} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
}
