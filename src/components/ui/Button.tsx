'use client';

import { forwardRef } from 'react';

type Variant = 'primary' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/**
 * Accent-aware action button. Reads `--accent` from the nearest styled
 * ancestor so it recolors with the active meeting type. Presentational only.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className = '', children, ...props },
  ref,
) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-mono text-xs uppercase tracking-[0.18em] transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510] disabled:cursor-not-allowed disabled:opacity-40';

  const variants: Record<Variant, string> = {
    primary:
      'text-[#050510] [background:var(--accent,#22d3ee)] hover:brightness-110 hover:-translate-y-px focus-visible:ring-[color:var(--accent,#22d3ee)] shadow-[0_0_24px_-6px_var(--accent,#22d3ee)]',
    ghost:
      'border border-white/12 bg-white/[0.02] text-slate-300 hover:border-[color:var(--accent,#22d3ee)]/50 hover:text-white focus-visible:ring-[color:var(--accent,#22d3ee)]',
  };

  return (
    <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
});
