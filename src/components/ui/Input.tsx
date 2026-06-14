'use client';

import { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

/** Accessible labelled text input in the console aesthetic. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, id, className = '', ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-400"
      >
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-describedby={hintId}
        className={`focus-visible:border-[color:var(--accent,#22d3ee)]/60 focus-visible:ring-[color:var(--accent,#22d3ee)]/40 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition-colors placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-1 ${className}`}
        {...props}
      />
      {hint ? (
        <span id={hintId} className="font-mono text-[0.65rem] text-slate-500">
          {hint}
        </span>
      ) : null}
    </div>
  );
});
