'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ConsoleFrame } from './ConsoleFrame';
import { longDayLabel, timeLabel } from './format';

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
    <ConsoleFrame label="// Manage booking" className="mx-auto max-w-md">
      {phase === 'loading' ? (
        <p className="py-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-500">
          Loading…
        </p>
      ) : phase === 'notfound' ? (
        <Message
          title="Booking not found"
          body="This cancellation link is invalid or has expired."
        />
      ) : phase === 'error' ? (
        <Message title="Something went wrong" body="Please try again in a moment." />
      ) : phase === 'cancelled' ? (
        <Message
          title="Booking cancelled"
          body="That time has been freed up. Thanks for letting us know."
        />
      ) : booking ? (
        <div className="flex flex-col gap-5">
          <p className="text-sm text-slate-300">Cancel this booking?</p>
          <div className="space-y-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 font-mono text-sm">
            <Row label="Meeting" value={booking.meetingTypeName} />
            <Row label="Date" value={longDayLabel(booking.startUtc, tz)} />
            <Row
              label="Time"
              value={`${timeLabel(booking.startUtc, tz)} · ${tz.replace(/_/g, ' ')}`}
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={cancel} disabled={phase === 'cancelling'}>
              {phase === 'cancelling' ? 'Cancelling…' : 'Cancel booking'}
            </Button>
            <Button variant="ghost" onClick={() => history.back()}>
              Keep it
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mt-6 text-center">
        <Link
          href="/book"
          className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-slate-300"
        >
          ‹ Back to booking
        </Link>
      </div>
    </ConsoleFrame>
  );
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-6 text-center">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{body}</p>
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
