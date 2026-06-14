'use client';

import { siteConfig } from '@/lib/site';
import type { MeetingType } from '@/lib/scheduling/types';
import { offsetLabel, timezoneOptions } from './timezone';

interface SummaryRailProps {
  meetingType: MeetingType | null;
  dayLabel: string | null;
  timeLabel: string | null;
  timezone: string;
  detectedTimezone: string;
  onTimezoneChange: (tz: string) => void;
}

export function SummaryRail({
  meetingType,
  dayLabel,
  timeLabel,
  timezone,
  detectedTimezone,
  onTimezoneChange,
}: SummaryRailProps) {
  return (
    <div className="flex h-full flex-col gap-7">
      <div className="flex items-center gap-3">
        <span
          className="border-[color:var(--accent,#22d3ee)]/40 flex h-12 w-12 items-center justify-center rounded-xl border font-mono text-base font-bold text-[color:var(--accent,#22d3ee)]"
          style={{ background: 'color-mix(in srgb, var(--accent, #22d3ee) 10%, transparent)' }}
          aria-hidden
        >
          JS
        </span>
        <div>
          <div className="text-base font-semibold text-white">{siteConfig.author}</div>
          <div className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
            Engineer · Builder
          </div>
        </div>
      </div>

      <p className="max-w-xs text-sm leading-relaxed text-slate-400">
        Pick a meeting type and a time that works for you. You&apos;ll get an instant confirmation
        and a calendar invite — no account, no back-and-forth.
      </p>

      <div className="space-y-3 border-t border-white/[0.06] pt-6">
        <div className="font-mono text-[0.6rem] uppercase tracking-[0.28em] text-slate-600">
          Transmission details
        </div>
        <DetailRow label="Type" value={meetingType?.name ?? null} />
        <DetailRow label="Duration" value={meetingType ? `${meetingType.durationMin} min` : null} />
        <DetailRow label="Date" value={dayLabel} />
        <DetailRow label="Time" value={timeLabel} />
      </div>

      <div className="mt-auto space-y-1.5 pt-6">
        <label
          htmlFor="tz-select"
          className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-slate-500"
        >
          Times shown in
        </label>
        <div className="relative">
          <select
            id="tz-select"
            value={timezone}
            onChange={(e) => onTimezoneChange(e.target.value)}
            className="focus-visible:border-[color:var(--accent,#22d3ee)]/60 focus-visible:ring-[color:var(--accent,#22d3ee)]/40 w-full appearance-none rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 pr-9 font-mono text-xs text-slate-200 transition-colors focus-visible:outline-none focus-visible:ring-1"
          >
            {timezoneOptions(detectedTimezone).map((tz) => (
              <option key={tz} value={tz} className="bg-[#0a0a16]">
                {tz.replace(/_/g, ' ')} ({offsetLabel(tz)})
              </option>
            ))}
          </select>
          <span
            aria-hidden
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
          >
            ▾
          </span>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-slate-500">
        {label}
      </span>
      <span
        className={`text-right text-sm ${value ? 'text-slate-100' : 'font-mono text-xs text-slate-700'}`}
      >
        {value ?? '— — —'}
      </span>
    </div>
  );
}
