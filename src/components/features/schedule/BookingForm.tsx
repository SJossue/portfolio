'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import type { BookingInput } from '@/lib/scheduling/types';

interface BookingFormProps {
  meetingTypeId: string;
  startUtc: string;
  timezone: string;
  onConfirmed: () => void;
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
        onConfirmed();
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
      <Input
        label="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="name"
        required
        placeholder="Ada Lovelace"
      />
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
        placeholder="you@example.com"
        hint="Your calendar invite + confirmation land here."
      />
      <Textarea
        label="What's this about? (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="A sentence or two of context helps."
      />

      {status === 'error' ? (
        <p role="alert" className="font-mono text-xs text-rose-400">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={status === 'submitting'} className="mt-1">
        {status === 'submitting' ? 'Confirming…' : 'Confirm booking'}
      </Button>
    </form>
  );
}
