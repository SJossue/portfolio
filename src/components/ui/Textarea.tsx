'use client';

import { forwardRef, useId } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

/** Labelled textarea with a plain, familiar look. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, id, className = '', ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={fieldId} className="text-sm font-medium text-slate-300">
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        className={`border-white/12 min-h-[88px] resize-y rounded-lg border bg-white/[0.04] px-3.5 py-2.5 text-sm text-white transition-colors placeholder:text-slate-500 focus-visible:border-cyan-400/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40 ${className}`}
        {...props}
      />
    </div>
  );
});
