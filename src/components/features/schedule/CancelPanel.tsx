'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { longDayLabel, timeLabel } from './format';
import { CalendarIcon, ClockIcon } from './icons';

interface BookingSummary {
  meetingTypeName: string;
  startUtc: string;
  inviteeName: string;
  inviteeTimezone: string;
  status: string;
}

type Phase = 'loading' | 'ready' | 'cancelling' | 'cancelled' | 'notfound' | 'error';

export function CancelPanel({ token }: { token: string }) {
  const [phase, setPhase] = useState<Phase>(token ? 'loading' : 'notfound');
  const [booking, setBooking] = useState<BookingSummary | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    (async () => {
      try {
        const res = await fetch(`/api/schedule/cancel?token=${encodeURIComponent(token)}`);
        if (!active) return;
        if (res.status === 404) return setPhase('notfound');
        if (!res.ok) return setPhase('error');
        const data = (await res.json()) as BookingSummary;
        setBooking(data);
        setPhase(data.status === 'cancelled' ? 'cancelled' : 'ready');
      } catch {
        if (active) setPhase('error');
      }
    })();
    return () => {
      active = false;
    };
  }, [token]);

  async function cancel() {
    setPhase('cancelling');
    try {
      const res = await fetch('/api/schedule/cancel', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      setPhase(res.ok ? 'cancelled' : 'error');
    } catch {
      setPhase('error');
    }
  }

  const tz = booking?.inviteeTimezone ?? 'UTC';

  return (
    <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
      {phase === 'loading' ? (
        <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
      ) : phase === 'notfound' ? (
        <Message title="Booking not found" body="This link is invalid or has expired." />
      ) : phase === 'error' ? (
        <Message title="Something went wrong" body="Please try again in a moment." />
      ) : phase === 'cancelled' ? (
        <Message
          title="Booking cancelled"
          body="That time is now free again. Thanks for letting me know."
        />
      ) : booking ? (
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-semibold text-white">Cancel this booking?</h1>
          <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
            <div className="font-medium text-white">{booking.meetingTypeName}</div>
            <div className="flex items-center gap-2 text-slate-300">
              <CalendarIcon className="h-4 w-4 text-slate-500" />
              {longDayLabel(booking.startUtc, tz)}
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ClockIcon className="h-4 w-4 text-slate-500" />
              {timeLabel(booking.startUtc, tz)}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={cancel} disabled={phase === 'cancelling'}>
              {phase === 'cancelling' ? 'Cancelling…' : 'Cancel booking'}
            </Button>
            <Button variant="secondary" onClick={() => history.back()}>
              Keep it
            </Button>
          </div>
          <Link
            href={`/book/reschedule?token=${encodeURIComponent(token)}`}
            className="text-sm text-cyan-300 transition-colors hover:text-cyan-200"
          >
            Or reschedule to a new time instead
          </Link>
        </div>
      ) : null}

      <div className="mt-6 text-center">
        <Link
          href="/book"
          className="text-sm text-slate-500 transition-colors hover:text-slate-300"
        >
          Book a different time
        </Link>
      </div>
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
