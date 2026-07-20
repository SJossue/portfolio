'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { identifyLogRocketUser } from '@/lib/logrocket';
import type { BookingInput } from '@/lib/scheduling/types';

interface BookingFormProps {
  meetingTypeId: string;
  startUtc: string;
  timezone: string;
  onConfirmed: (videoUrl?: string) => void;
  onSlotTaken: () => void;
}

type Status = 'idle' | 'submitting' | 'error';

export function BookingForm({
  meetingTypeId,
  startUtc,
  timezone,
  onConfirmed,
  onSlotTaken,
}: BookingFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    const payload: BookingInput = { meetingTypeId, startUtc, name, email, timezone, notes };

    try {
      const res = await fetch('/api/schedule/book', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const data = (await res.json().catch(() => ({}))) as { videoUrl?: string };
        // Link this replay session to the person who just booked (the one point where
        // the site learns a visitor's identity). Fire-and-forget; deployed-only.
        void identifyLogRocketUser(email, { name, email });
        onConfirmed(data.videoUrl);
        return;
      }
      if (res.status === 409) {
        onSlotTaken();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? 'Something went wrong. Please try again.');
      setStatus('error');
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <h2 className="text-lg font-semibold text-white">Enter your details</h2>

      <Input
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
        placeholder="Your name"
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        placeholder="you@example.com"
        hint="Your confirmation and calendar invite go here."
      />
      <Textarea
        label="Anything I should know? (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="A sentence of context helps me prepare."
      />

      {status === 'error' ? (
        <p role="alert" className="text-sm text-rose-400">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={status === 'submitting'} className="mt-1 w-full sm:w-auto">
        {status === 'submitting' ? 'Scheduling…' : 'Schedule meeting'}
      </Button>
    </form>
  );
}
