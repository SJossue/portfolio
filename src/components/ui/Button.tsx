'use client';

import { forwardRef } from 'react';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

/** Plain, familiar action button. Presentational only. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', className = '', children, ...props },
  ref,
) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d14] disabled:cursor-not-allowed disabled:opacity-50';

  const variants: Record<Variant, string> = {
    primary: 'bg-cyan-500 text-[#06060c] hover:bg-cyan-400',
    secondary: 'border border-white/15 text-slate-200 hover:bg-white/5',
  };

  return (
    <button ref={ref} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
});
