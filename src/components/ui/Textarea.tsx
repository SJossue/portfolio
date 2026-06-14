'use client';

import { forwardRef, useId } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

/** Accessible labelled textarea in the console aesthetic. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, id, className = '', ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-400"
      >
        {label}
      </label>
      <textarea
        ref={ref}
        id={fieldId}
        className={`focus-visible:border-[color:var(--accent,#22d3ee)]/60 focus-visible:ring-[color:var(--accent,#22d3ee)]/40 min-h-[88px] resize-y rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white transition-colors placeholder:text-slate-600 focus-visible:outline-none focus-visible:ring-1 ${className}`}
        {...props}
      />
    </div>
  );
});
