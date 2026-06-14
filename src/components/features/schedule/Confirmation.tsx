'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { addMinutes } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { buildIcs } from '@/lib/scheduling/ics';
import { siteConfig } from '@/lib/site';
import type { MeetingType } from '@/lib/scheduling/types';
import { longDayLabel, timeLabel } from './format';

interface ConfirmationProps {
  meetingType: MeetingType;
  startUtc: string;
  timezone: string;
  onReset: () => void;
}

export function Confirmation({ meetingType, startUtc, timezone, onReset }: ConfirmationProps) {
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
    <div className="flex flex-col items-center px-2 py-4 text-center">
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        initial={reduce ? false : { scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        aria-hidden
      >
        <circle
          cx="32"
          cy="32"
          r="29"
          stroke="var(--accent, #22d3ee)"
          strokeWidth="2"
          opacity="0.4"
        />
        <motion.path
          d="M20 33 L29 42 L45 24"
          stroke="var(--accent, #22d3ee)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
        />
      </motion.svg>

      <div className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-[color:var(--accent,#22d3ee)]">
        Booking confirmed
      </div>
      <h2 className="mt-2 text-2xl font-semibold text-white">You&apos;re on the calendar.</h2>

      <div className="mt-6 w-full max-w-sm space-y-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5 text-left font-mono text-sm">
        <Row label="Meeting" value={meetingType.name} />
        <Row label="Date" value={longDayLabel(startUtc, timezone)} />
        <Row
          label="Time"
          value={`${timeLabel(startUtc, timezone)} · ${meetingType.durationMin}m`}
        />
        <Row label="Zone" value={timezone.replace(/_/g, ' ')} />
      </div>

      <p className="mt-5 max-w-sm text-xs leading-relaxed text-slate-400">
        A confirmation and calendar invite are on the way to your inbox.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button onClick={addToCalendar}>Add to calendar</Button>
        <Button variant="ghost" onClick={onReset}>
          Book another
        </Button>
      </div>

      <Link
        href="/"
        className="mt-6 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-slate-300"
      >
        ‹ Return to base
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-[0.6rem] uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <span className="text-right text-slate-100">{value}</span>
    </div>
  );
}
