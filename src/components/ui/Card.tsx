import type { PropsWithChildren } from 'react';

interface CardProps extends PropsWithChildren {
  className?: string;
}

/** A calm, elevated surface — the familiar "app card" container. */
export function Card({ className = '', children }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-[#0d0d14]/90 shadow-2xl shadow-black/40 backdrop-blur ${className}`}
    >
      {children}
    </div>
  );
}
