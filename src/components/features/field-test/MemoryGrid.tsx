'use client';

import { GRID_SIZE } from '@/content/field-test';

interface MemoryGridProps {
  /** Indices currently lit (playback mode). Ignored when `onTap` is set. */
  lit?: number[];
  /** Indices already tapped, in order (recall mode). */
  picked?: number[];
  /** Present in recall mode; omit to render a passive, non-interactive grid. */
  onTap?: (index: number) => void;
}

/** A 3x3 tile grid used both to play a pattern and to recall it. Presentational + input only. */
export function MemoryGrid({ lit = [], picked = [], onTap }: MemoryGridProps) {
  const interactive = typeof onTap === 'function';

  return (
    <div className="grid max-w-[280px] grid-cols-3 gap-2.5">
      {Array.from({ length: GRID_SIZE }, (_, i) => {
        const isLit = lit.includes(i);
        const isPicked = picked.includes(i);
        const base =
          'aspect-square rounded-xl border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d14]';
        const look = isLit
          ? 'border-cyan-400 bg-cyan-400/80 scale-95'
          : isPicked
            ? 'border-cyan-400 bg-cyan-500/30'
            : 'border-white/12 bg-white/[0.04]';
        const hover = interactive && !isLit ? 'hover:border-cyan-400/60 cursor-pointer' : '';

        if (!interactive) {
          return <div key={i} className={`${base} ${look}`} aria-hidden="true" />;
        }

        return (
          <button
            key={i}
            type="button"
            className={`${base} ${look} ${hover}`}
            onClick={() => onTap(i)}
            aria-label={`Tile ${i + 1}`}
          />
        );
      })}
    </div>
  );
}
