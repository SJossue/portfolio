'use client';

import { meetingTypes } from '@/content/scheduling';

interface MeetingTypePickerProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MeetingTypePicker({ selectedId, onSelect }: MeetingTypePickerProps) {
  return (
    <div className="grid gap-3" role="radiogroup" aria-label="Meeting type">
      {meetingTypes.map((type) => {
        const selected = type.id === selectedId;
        return (
          <button
            key={type.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onSelect(type.id)}
            style={{ ['--accent' as string]: type.accent }}
            className={`group relative overflow-hidden rounded-xl border p-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510] ${
              selected
                ? 'border-[color:var(--accent)]/60 bg-[color:var(--accent)]/[0.06] shadow-[0_0_30px_-10px_var(--accent)]'
                : 'hover:border-[color:var(--accent)]/40 border-white/[0.07] bg-white/[0.01] hover:-translate-y-px'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-9 w-1 rounded-full transition-all duration-200 group-hover:h-10"
                  style={{
                    background: 'var(--accent)',
                    boxShadow: selected ? '0 0 12px var(--accent)' : 'none',
                  }}
                />
                <div>
                  <div className="font-sans text-base font-semibold text-white">{type.name}</div>
                  <p className="mt-0.5 max-w-sm text-xs leading-relaxed text-slate-400">
                    {type.description}
                  </p>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.15em] text-[color:var(--accent)]">
                {type.durationMin}m
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
