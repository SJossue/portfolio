'use client';

import type { Slot } from '@/lib/scheduling/types';
import { timeLabel } from './format';

interface SlotListProps {
  slots: Slot[];
  timezone: string;
  selectedUtc: string | null;
  onSelect: (startUtc: string) => void;
}

/** A single column of selectable times for the chosen day — the familiar
 *  Calendly time list. */
export function SlotList({ slots, timezone, selectedUtc, onSelect }: SlotListProps) {
  if (slots.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">No times left on this day.</p>;
  }

  return (
    <ul
      role="listbox"
      aria-label="Available times"
      className="flex max-h-[332px] flex-col gap-2 overflow-y-auto pr-1"
    >
      {slots.map((slot) => {
        const selected = slot.startUtc === selectedUtc;
        return (
          <li key={slot.startUtc}>
            <button
              role="option"
              aria-selected={selected}
              onClick={() => onSelect(slot.startUtc)}
              className={`w-full rounded-lg border py-3 text-center text-sm font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${
                selected
                  ? 'border-cyan-500 bg-cyan-500 text-[#06060c]'
                  : 'border-white/15 text-slate-200 hover:border-cyan-400/60 hover:text-white'
              }`}
            >
              {timeLabel(slot.startUtc, timezone)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
