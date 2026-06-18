'use client';

import { siteConfig } from '@/lib/site';
import type { MeetingType } from '@/lib/scheduling/types';
import { CalendarIcon, ClockIcon } from './icons';

interface EventDetailsProps {
  meetingType: MeetingType | null;
  dayLabel: string | null;
  timeLabel: string | null;
}

/** The left "what you're booking" panel — host, meeting, duration, and the
 *  chosen date/time once selected. Mirrors the familiar Calendly event rail. */
export function SummaryRail({ meetingType, dayLabel, timeLabel }: EventDetailsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span
          className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold text-cyan-300"
          aria-hidden
        >
          JS
        </span>
        <div>
          <div className="text-sm text-slate-400">{siteConfig.author}</div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white">{meetingType?.name ?? 'Book a call'}</h2>
        {meetingType ? (
          <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
            <ClockIcon className="h-4 w-4 text-slate-500" />
            {meetingType.durationMin} min
          </div>
        ) : null}
      </div>

      {meetingType?.description ? (
        <p className="text-sm leading-relaxed text-slate-400">{meetingType.description}</p>
      ) : null}

      {dayLabel && timeLabel ? (
        <div className="flex items-start gap-2 rounded-lg border border-cyan-400/20 bg-cyan-500/[0.06] px-3 py-2.5 text-sm text-cyan-100">
          <CalendarIcon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
          <span>
            {timeLabel}
            <br />
            {dayLabel}
          </span>
        </div>
      ) : null}
    </div>
  );
}
