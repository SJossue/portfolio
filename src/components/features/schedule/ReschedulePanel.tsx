'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { Slot } from '@/lib/scheduling/types';
import { groupByDay, longDayLabel, timeLabel } from './format';
import { CalendarIcon, CheckIcon, GlobeIcon } from './icons';
import { MonthCalendar } from './MonthCalendar';
import { SlotList } from './SlotList';
import { detectTimezone, offsetLabel, timezoneOptions } from './timezone';

interface BookingSummary {
  meetingTypeId: string;
  meetingTypeName: string;
  startUtc: string;
  inviteeTimezone: string;
  status: string;
}

type Phase = 'loading' | 'ready' | 'submitting' | 'done' | 'notfound' | 'cancelled' | 'error';

export function ReschedulePanel({ token }: { token: string }) {
  const [phase, setPhase] = useState<Phase>(token ? 'loading' : 'notfound');
  const [booking, setBooking] = useState<BookingSummary | null>(null);
  const [timezone, setTimezone] = useState('UTC');
  const [detected, setDetected] = useState('UTC');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [dayKey, setDayKey] = useState<string | null>(null);
  const [slotUtc, setSlotUtc] = useState<string | null>(null);
  const [newStartUtc, setNewStartUtc] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchAvailability = useCallback(async (typeId: string) => {
    setLoadingSlots(true);
    try {
      const res = await fetch(`/api/schedule/availability?type=${encodeURIComponent(typeId)}`);
      const data = (await res.json()) as { slots?: Slot[] };
      setSlots(res.ok ? (data.slots ?? []) : []);
    } catch {
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    const tz = detectTimezone();
    setDetected(tz);
    setTimezone(tz);
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/schedule/cancel?token=${encodeURIComponent(token)}`);
        if (!active) return;
        if (res.status === 404) return setPhase('notfound');
        if (!res.ok) return setPhase('error');
        const data = (await res.json()) as BookingSummary;
        setBooking(data);
        if (data.status === 'cancelled') return setPhase('cancelled');
        setPhase('ready');
        void fetchAvailability(data.meetingTypeId);
      } catch {
        if (active) setPhase('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [token, fetchAvailability]);

  const byDay = useMemo(() => groupByDay(slots, timezone), [slots, timezone]);
  const availableDayKeys = useMemo(() => new Set(byDay.keys()), [byDay]);
  const daySlots = dayKey ? (byDay.get(dayKey) ?? []) : [];
  const dayHeading = dayKey
    ? new Date(`${dayKey}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;

  async function confirm() {
    if (!slotUtc) return;
    setPhase('submitting');
    setNotice(null);
    try {
      const res = await fetch('/api/schedule/reschedule', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token, startUtc: slotUtc }),
      });
      if (res.ok) {
        const data = (await res.json()) as { startUtc: string };
        setNewStartUtc(data.startUtc);
        setPhase('done');
        return;
      }
      if (res.status === 409) {
        setNotice('That time was just taken — pick another.');
        setSlotUtc(null);
        if (booking) void fetchAvailability(booking.meetingTypeId);
        setPhase('ready');
        return;
      }
      setPhase('error');
    } catch {
      setPhase('error');
    }
  }

  return (
    <Card className="mx-auto w-full max-w-3xl p-6 sm:p-8">
      {phase === 'loading' ? (
        <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
      ) : phase === 'notfound' ? (
        <Message title="Booking not found" body="This link is invalid or has expired." />
      ) : phase === 'cancelled' ? (
        <Message
          title="Booking cancelled"
          body="This booking was cancelled, so there's nothing to reschedule."
        />
      ) : phase === 'error' ? (
        <Message title="Something went wrong" body="Please try again in a moment." />
      ) : phase === 'done' && booking && newStartUtc ? (
        <div className="flex flex-col items-center py-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-300">
            <CheckIcon className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-semibold text-white">Rescheduled</h1>
          <p className="mt-2 text-sm text-slate-400">
            Your {booking.meetingTypeName.toLowerCase()} is moved. A new invite is on the way.
          </p>
          <div className="mt-5 flex items-center gap-2 rounded-lg border border-cyan-400/20 bg-cyan-500/[0.06] px-4 py-3 text-sm text-cyan-100">
            <CalendarIcon className="h-4 w-4 text-cyan-300" />
            {longDayLabel(newStartUtc, timezone)} · {timeLabel(newStartUtc, timezone)}
          </div>
          <Link
            href="/"
            className="mt-6 text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            Back to jossue.dev
          </Link>
        </div>
      ) : booking ? (
        <div>
          <h1 className="text-xl font-semibold text-white">
            Reschedule your {booking.meetingTypeName.toLowerCase()}
          </h1>
          <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-400">
            <CalendarIcon className="h-4 w-4 text-slate-500" />
            Currently {longDayLabel(booking.startUtc, timezone)} at{' '}
            {timeLabel(booking.startUtc, timezone)}
          </p>

          {notice ? (
            <p
              role="status"
              className="mt-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200"
            >
              {notice}
            </p>
          ) : null}

          <div className="mt-6 grid gap-6 sm:grid-cols-[minmax(0,1fr)_200px]">
            <div>
              <MonthCalendar
                availableDayKeys={availableDayKeys}
                selectedKey={dayKey}
                loading={loadingSlots}
                onSelectDay={(k) => {
                  setDayKey(k);
                  setSlotUtc(null);
                }}
              />
              <label className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                <GlobeIcon className="h-4 w-4 text-slate-500" />
                <span className="sr-only">Timezone</span>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="rounded-md border border-white/10 bg-transparent py-1 text-sm text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40"
                >
                  {timezoneOptions(detected).map((tz) => (
                    <option key={tz} value={tz} className="bg-[#0d0d14]">
                      {tz.replace(/_/g, ' ')} ({offsetLabel(tz)})
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {dayKey ? (
              <div className="min-w-0">
                <div className="mb-3 text-sm font-medium text-white">{dayHeading}</div>
                <SlotList
                  slots={daySlots}
                  timezone={timezone}
                  selectedUtc={slotUtc}
                  onSelect={setSlotUtc}
                />
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
            <Button onClick={confirm} disabled={!slotUtc || phase === 'submitting'}>
              {phase === 'submitting' ? 'Rescheduling…' : 'Confirm new time'}
            </Button>
            <Link
              href={`/book/cancel?token=${encodeURIComponent(token)}`}
              className="text-sm text-slate-500 transition-colors hover:text-slate-300"
            >
              Cancel instead
            </Link>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-6 text-center">
      <h1 className="text-xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
    </div>
  );
}
