'use client';

import type { Slot } from '@/lib/scheduling/types';
import { timeLabel } from './format';

interface SlotListProps {
  slots: Slot[];
  timezone: string;
  selectedUtc: string | null;
  onSelect: (startUtc: string) => void;
}

export function SlotList({ slots, timezone, selectedUtc, onSelect }: SlotListProps) {
  if (slots.length === 0) {
    return (
      <p className="py-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
        No open slots — try another day.
      </p>
    );
  }

  return (
    <div
      role="listbox"
      aria-label="Available times"
      className="grid max-h-[280px] grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3"
    >
      {slots.map((slot) => {
        const selected = slot.startUtc === selectedUtc;
        return (
          <button
            key={slot.startUtc}
            role="option"
            aria-selected={selected}
            onClick={() => onSelect(slot.startUtc)}
            className={`rounded-lg border py-2.5 text-center font-mono text-sm tabular-nums transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent,#22d3ee)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510] ${
              selected
                ? 'border-[color:var(--accent,#22d3ee)] bg-[color:var(--accent,#22d3ee)] text-[#050510] shadow-[0_0_18px_-4px_var(--accent,#22d3ee)]'
                : 'hover:border-[color:var(--accent,#22d3ee)]/50 border-white/10 bg-white/[0.02] text-slate-200 hover:-translate-y-px hover:text-white'
            }`}
          >
            {timeLabel(slot.startUtc, timezone)}
          </button>
        );
      })}
    </div>
  );
}
