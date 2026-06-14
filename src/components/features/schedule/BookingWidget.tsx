'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { meetingTypeById } from '@/content/scheduling';
import type { Slot } from '@/lib/scheduling/types';
import { BookingForm } from './BookingForm';
import { ConsoleFrame } from './ConsoleFrame';
import { Confirmation } from './Confirmation';
import { groupByDay, longDayLabel, timeLabel } from './format';
import { MeetingTypePicker } from './MeetingTypePicker';
import { MonthCalendar } from './MonthCalendar';
import { SlotList } from './SlotList';
import { SummaryRail } from './SummaryRail';
import { useBooking, type BookingStep } from './store';
import { detectTimezone } from './timezone';

const STEPS: { key: BookingStep; label: string }[] = [
  { key: 'type', label: 'Meeting' },
  { key: 'date', label: 'Date' },
  { key: 'time', label: 'Time' },
  { key: 'details', label: 'Details' },
];

const FRAME_LABELS: Record<BookingStep, string> = {
  type: '01 / Choose a meeting',
  date: '02 / Pick a day',
  time: '03 / Pick a time',
  details: '04 / Your details',
  done: 'Confirmed',
};

export function BookingWidget() {
  const {
    step,
    meetingTypeId,
    dayKey,
    slotUtc,
    timezone,
    setTimezone,
    selectType,
    selectDay,
    selectSlot,
    goTo,
    complete,
    reset,
  } = useBooking();

  const reduce = useReducedMotion();
  const [detected, setDetected] = useState('UTC');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Detect the visitor's timezone once, client-side.
  useEffect(() => {
    const tz = detectTimezone();
    setDetected(tz);
    setTimezone(tz);
  }, [setTimezone]);

  const fetchAvailability = useCallback(async (typeId: string) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/schedule/availability?type=${encodeURIComponent(typeId)}`, {
        signal: ctrl.signal,
      });
      const data = (await res.json()) as { slots?: Slot[] };
      setSlots(res.ok ? (data.slots ?? []) : []);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') setSlots([]);
    } finally {
      if (!ctrl.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (meetingTypeId) void fetchAvailability(meetingTypeId);
  }, [meetingTypeId, fetchAvailability]);

  const selectedType = meetingTypeId ? meetingTypeById(meetingTypeId) : undefined;
  const accent = selectedType?.accent ?? '#22d3ee';

  const byDay = useMemo(() => groupByDay(slots, timezone), [slots, timezone]);
  const availableDayKeys = useMemo(() => new Set(byDay.keys()), [byDay]);
  const daySlots = dayKey ? (byDay.get(dayKey) ?? []) : [];

  const railDayLabel = slotUtc
    ? longDayLabel(slotUtc, timezone)
    : dayKey
      ? new Date(`${dayKey}T12:00:00`).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })
      : null;
  const railTimeLabel = slotUtc ? timeLabel(slotUtc, timezone) : null;

  const maxReached = slotUtc ? 4 : dayKey ? 3 : meetingTypeId ? 2 : 1;

  function handleSlotTaken() {
    setNotice('That time was just booked by someone else — pick another.');
    if (meetingTypeId) void fetchAvailability(meetingTypeId);
    goTo('time');
  }

  return (
    <div
      style={{ ['--accent' as string]: accent }}
      className="grid gap-4 lg:grid-cols-[320px_1fr] lg:gap-6"
    >
      <ConsoleFrame label="// Briefing" className="lg:sticky lg:top-8 lg:self-start">
        <SummaryRail
          meetingType={selectedType ?? null}
          dayLabel={railDayLabel}
          timeLabel={railTimeLabel}
          timezone={timezone}
          detectedTimezone={detected}
          onTimezoneChange={setTimezone}
        />
      </ConsoleFrame>

      <ConsoleFrame label={FRAME_LABELS[step]} className="min-h-[460px]">
        {step !== 'done' ? <Stepper current={step} maxReached={maxReached} onJump={goTo} /> : null}

        {notice ? (
          <p
            role="status"
            className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/[0.06] px-3 py-2 font-mono text-[0.7rem] text-amber-300"
          >
            {notice}
          </p>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {step === 'type' && (
              <MeetingTypePicker selectedId={meetingTypeId} onSelect={selectType} />
            )}

            {step === 'date' && (
              <MonthCalendar
                availableDayKeys={availableDayKeys}
                selectedKey={dayKey}
                loading={loading}
                onSelectDay={selectDay}
              />
            )}

            {step === 'time' && (
              <SlotList
                slots={daySlots}
                timezone={timezone}
                selectedUtc={slotUtc}
                onSelect={selectSlot}
              />
            )}

            {step === 'details' && selectedType && slotUtc && (
              <BookingForm
                meetingTypeId={selectedType.id}
                startUtc={slotUtc}
                timezone={timezone}
                onConfirmed={complete}
                onSlotTaken={handleSlotTaken}
              />
            )}

            {step === 'done' && selectedType && slotUtc && (
              <Confirmation
                meetingType={selectedType}
                startUtc={slotUtc}
                timezone={timezone}
                onReset={() => {
                  setSlots([]);
                  reset();
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </ConsoleFrame>
    </div>
  );
}

function Stepper({
  current,
  maxReached,
  onJump,
}: {
  current: BookingStep;
  maxReached: number;
  onJump: (step: BookingStep) => void;
}) {
  return (
    <nav aria-label="Booking progress" className="mb-6 flex items-center gap-2">
      {STEPS.map((s, i) => {
        const num = i + 1;
        const active = s.key === current;
        const reached = num <= maxReached;
        return (
          <button
            key={s.key}
            type="button"
            disabled={!reached || active}
            onClick={() => onJump(s.key)}
            aria-current={active ? 'step' : undefined}
            className={`flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.15em] transition-colors ${
              active
                ? 'text-[color:var(--accent,#22d3ee)]'
                : reached
                  ? 'text-slate-400 hover:text-white'
                  : 'cursor-default text-slate-700'
            }`}
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border text-[0.6rem] ${
                active
                  ? 'border-[color:var(--accent,#22d3ee)] text-[color:var(--accent,#22d3ee)]'
                  : reached
                    ? 'border-slate-600 text-slate-400'
                    : 'border-slate-800 text-slate-700'
              }`}
            >
              {num}
            </span>
            <span className="hidden sm:inline">{s.label}</span>
            {i < STEPS.length - 1 ? (
              <span aria-hidden className="text-slate-700">
                ·
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
