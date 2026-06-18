'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { addMinutes } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { buildIcs } from '@/lib/scheduling/ics';
import { siteConfig } from '@/lib/site';
import type { MeetingType } from '@/lib/scheduling/types';
import { longDayLabel, timeLabel } from './format';
import { CalendarIcon, CheckIcon, ClockIcon, VideoIcon } from './icons';

interface ConfirmationProps {
  meetingType: MeetingType;
  startUtc: string;
  timezone: string;
  videoUrl?: string | null;
  onReset: () => void;
}

export function Confirmation({
  meetingType,
  startUtc,
  timezone,
  videoUrl,
  onReset,
}: ConfirmationProps) {
  const reduce = useReducedMotion();
  const start = new Date(startUtc);
  const end = addMinutes(start, meetingType.durationMin);

  function addToCalendar() {
    const ics = buildIcs({
      uid: `${start.getTime()}@jossue.dev`,
      start,
      end,
      summary: `${meetingType.name} with ${siteConfig.author}`,
      description: 'Booked via jossue.dev',
      organizerEmail: 'hi@jossue.dev',
      attendeeEmail: 'hi@jossue.dev',
    });
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invite.ics';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-2 py-8 text-center">
      <motion.span
        className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300"
        initial={reduce ? false : { scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <CheckIcon className="h-7 w-7" />
      </motion.span>

      <h2 className="mt-5 text-2xl font-semibold text-white">You&apos;re booked</h2>
      <p className="mt-2 text-sm text-slate-400">
        A confirmation and calendar invite are on the way to your inbox.
      </p>

      <div className="mt-6 w-full space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-5 text-left text-sm">
        <div className="font-medium text-white">{meetingType.name}</div>
        <div className="flex items-center gap-2 text-slate-300">
          <CalendarIcon className="h-4 w-4 text-slate-500" />
          {longDayLabel(startUtc, timezone)}
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <ClockIcon className="h-4 w-4 text-slate-500" />
          {timeLabel(startUtc, timezone)} · {meetingType.durationMin} min
        </div>
        {videoUrl ? (
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 break-all text-cyan-300 transition-colors hover:text-cyan-200"
          >
            <VideoIcon className="h-4 w-4 shrink-0 text-cyan-400" />
            Join the Zoom call
          </a>
        ) : null}
      </div>

      <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button onClick={addToCalendar}>Add to calendar</Button>
        <Button variant="secondary" onClick={onReset}>
          Book another time
        </Button>
      </div>

      <Link href="/" className="mt-6 text-sm text-slate-500 transition-colors hover:text-slate-300">
        Back to jossue.dev
      </Link>
    </div>
  );
}
