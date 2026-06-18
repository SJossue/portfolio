'use client';

import { meetingTypes } from '@/content/scheduling';
import { ChevronRight, ClockIcon } from './icons';

interface MeetingTypePickerProps {
  onSelect: (id: string) => void;
}

/** A simple, scannable list of meeting types — the familiar "pick an event"
 *  step. Each row reads like a menu item: name, duration, short description. */
export function MeetingTypePicker({ onSelect }: MeetingTypePickerProps) {
  return (
    <ul className="flex flex-col gap-3">
      {meetingTypes.map((type) => (
        <li key={type.id}>
          <button
            onClick={() => onSelect(type.id)}
            className="group flex w-full items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-left transition-colors hover:border-cyan-400/40 hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
          >
            <span
              className="h-10 w-1.5 shrink-0 rounded-full"
              style={{ background: type.accent }}
              aria-hidden
            />
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-white">{type.name}</span>
              <span className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                <ClockIcon className="h-3.5 w-3.5 text-slate-500" />
                {type.durationMin} min
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-slate-400">
                {type.description}
              </span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-600 transition-colors group-hover:text-cyan-300" />
          </button>
        </li>
      ))}
    </ul>
  );
}
