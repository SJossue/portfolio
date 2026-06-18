'use client';

import { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

/** Labelled text input with a plain, familiar look. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, id, className = '', ...props },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const hintId = hint ? `${inputId}-hint` : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        aria-describedby={hintId}
        className={`border-white/12 rounded-lg border bg-white/[0.04] px-3.5 py-2.5 text-sm text-white transition-colors placeholder:text-slate-500 focus-visible:border-cyan-400/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40 ${className}`}
        {...props}
      />
      {hint ? (
        <span id={hintId} className="text-xs text-slate-500">
          {hint}
        </span>
      ) : null}
    </div>
  );
});
