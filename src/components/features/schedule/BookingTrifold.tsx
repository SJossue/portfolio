'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import HubSocials from '@/components/features/hub/HubSocials';
import TrifoldLayout from '@/components/features/hub/trifold/TrifoldLayout';
import { meetingTypeById } from '@/content/scheduling';
import type { Slot } from '@/lib/scheduling/types';

import { BookingForm } from './BookingForm';
import { Confirmation } from './Confirmation';
import { groupByDay, longDayLabel, timeLabel } from './format';
import { GlobeIcon } from './icons';
import { MeetingTypePicker } from './MeetingTypePicker';
import { MonthCalendar } from './MonthCalendar';
import { SlotList } from './SlotList';
import { SummaryRail } from './SummaryRail';
import { useBooking } from './store';
import { detectTimezone, offsetLabel, timezoneOptions } from './timezone';

/** Per-meeting-type accent as "r, g, b" — drives the glass panels' glow via
 *  `--world-color-rgb`. Defaults to the hub cyan before a type is chosen. */
const ACCENT_RGB: Record<string, string> = {
  intro: '34, 211, 238',
  project: '167, 139, 250',
  mentoring: '244, 114, 182',
};
const DEFAULT_ACCENT = '34, 211, 238';

function prettyTz(tz: string) {
  return tz.replace(/_/g, ' ');
}

const eyebrow = 'font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45';

/**
 * The scheduler, rebuilt on the site's trifold shell: left = what you're
 * booking (summary + nav), center = the active step (type · calendar/slots ·
 * form · confirmation), right = what to expect. The booking store, availability
 * fetching, and every step component are reused unchanged — only the layout is
 * new — so the flow and its logic are untouched.
 */
export default function BookingTrifold() {
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

  const [detected, setDetected] = useState('UTC');
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

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
  const byDay = useMemo(() => groupByDay(slots, timezone), [slots, timezone]);
  const availableDayKeys = useMemo(() => new Set(byDay.keys()), [byDay]);
  const daySlots = dayKey ? (byDay.get(dayKey) ?? []) : [];
  const accentRgb = (meetingTypeId && ACCENT_RGB[meetingTypeId]) || DEFAULT_ACCENT;

  const dayHeading = dayKey
    ? new Date(`${dayKey}T12:00:00`).toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
    : null;
  const railDayLabel = slotUtc ? longDayLabel(slotUtc, timezone) : null;
  const railTimeLabel = slotUtc ? timeLabel(slotUtc, timezone) : null;

  function handleSlotTaken() {
    setNotice('Sorry — that time was just booked. Please pick another.');
    if (meetingTypeId) void fetchAvailability(meetingTypeId);
    goTo('schedule');
  }

  function back() {
    if (step === 'schedule') reset();
    else if (step === 'details') goTo('schedule');
  }

  const timezoneSelect = (
    <label className="mt-5 flex items-center gap-2 text-sm text-white/55">
      <GlobeIcon className="h-4 w-4 text-white/40" />
      <span className="sr-only">Timezone</span>
      <select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="max-w-full rounded-md border border-white/10 bg-transparent py-1 text-sm text-white/70 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[color:rgba(var(--world-color-rgb),0.4)]"
      >
        {timezoneOptions(detected).map((tz) => (
          <option key={tz} value={tz} className="bg-[#0d0d14]">
            {prettyTz(tz)} ({offsetLabel(tz)})
          </option>
        ))}
      </select>
    </label>
  );

  // ── Left panel — what you're booking + navigation ───────────────────────────
  const left = (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="flex flex-col gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
        >
          <span aria-hidden>&larr;</span> Hub
        </Link>
        {step === 'schedule' || step === 'details' ? (
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-2 self-start font-mono text-xs text-white/50 transition-colors hover:text-white"
          >
            <span aria-hidden>&larr;</span>{' '}
            {step === 'details' ? 'Change time' : 'Change call type'}
          </button>
        ) : null}
      </div>

      <SummaryRail
        meetingType={selectedType ?? null}
        dayLabel={railDayLabel}
        timeLabel={railTimeLabel}
      />
    </div>
  );

  // ── Center panel — the active step ──────────────────────────────────────────
  const center = (
    <div key={step} className="lg:h-full lg:overflow-y-auto">
      <div className="p-6 sm:p-8">
        {step === 'type' && (
          <div>
            <p className={eyebrow}>Book a call</p>
            <h1 className="mb-6 mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Pick what works
            </h1>
            <MeetingTypePicker onSelect={selectType} />
          </div>
        )}

        {step === 'schedule' && (
          <div>
            <p className={eyebrow}>Step 2 of 3</p>
            <h1 className="mb-5 mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Select a date &amp; time
            </h1>
            {notice ? (
              <p
                role="status"
                className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200"
              >
                {notice}
              </p>
            ) : null}
            <div className={dayKey ? 'grid gap-6 sm:grid-cols-[minmax(0,1fr)_200px]' : ''}>
              <div>
                <MonthCalendar
                  availableDayKeys={availableDayKeys}
                  selectedKey={dayKey}
                  loading={loading}
                  onSelectDay={selectDay}
                />
                {timezoneSelect}
              </div>
              {dayKey ? (
                <div className="min-w-0">
                  <div className="mb-3 text-sm font-medium text-white">{dayHeading}</div>
                  <SlotList
                    slots={daySlots}
                    timezone={timezone}
                    selectedUtc={slotUtc}
                    onSelect={selectSlot}
                  />
                </div>
              ) : null}
            </div>
          </div>
        )}

        {step === 'details' && selectedType && slotUtc && (
          <div>
            <p className={eyebrow}>Step 3 of 3</p>
            <h1 className="mb-5 mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Your details
            </h1>
            <BookingForm
              meetingTypeId={selectedType.id}
              startUtc={slotUtc}
              timezone={timezone}
              onConfirmed={(url) => {
                setVideoUrl(url ?? null);
                complete();
              }}
              onSlotTaken={handleSlotTaken}
            />
          </div>
        )}

        {step === 'done' && selectedType && slotUtc && (
          <Confirmation
            meetingType={selectedType}
            startUtc={slotUtc}
            timezone={timezone}
            videoUrl={videoUrl}
            onReset={() => {
              setSlots([]);
              setVideoUrl(null);
              reset();
            }}
          />
        )}
      </div>
    </div>
  );

  // ── Right panel — what to expect ────────────────────────────────────────────
  const steps: [string, string][] = [
    ['Pick a call type', 'Intro, project deep-dive, or mentoring.'],
    ['Choose a time', 'Live availability in your own timezone.'],
    ['Confirm', 'Instant calendar invite with a video link.'],
  ];
  const expect = [
    'Google Meet video call — link in your invite',
    'Reschedule or cancel anytime from the email',
    'No account, no back-and-forth',
  ];
  const right = (
    <div className="flex h-full flex-col gap-8 p-6 text-white">
      <section>
        <p className={`${eyebrow} mb-3`}>How it works</p>
        <ol className="space-y-3">
          {steps.map(([title, body], i) => (
            <li key={title} className="flex gap-3">
              <span
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold"
                style={{
                  background: `rgba(${accentRgb}, 0.14)`,
                  border: `1px solid rgba(${accentRgb}, 0.3)`,
                  color: `rgb(${accentRgb})`,
                }}
              >
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-semibold text-white">{title}</span>
                <span className="block text-xs text-white/55">{body}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <p className={`${eyebrow} mb-3`}>What to expect</p>
        <ul className="space-y-2">
          {expect.map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm text-white/70">
              <span
                aria-hidden
                className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ background: `rgba(${accentRgb}, 0.8)` }}
              />
              {line}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-auto flex justify-center pt-2">
        <HubSocials accentColor={`rgb(${accentRgb})`} accentRgb={accentRgb} layout="inline" />
      </div>
    </div>
  );

  return (
    <TrifoldLayout
      colorRgb={accentRgb}
      lead={
        <a
          href="#book-main"
          className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
        >
          Skip to booking
        </a>
      }
      left={{ as: 'aside', panelProps: { 'aria-label': 'Booking summary' }, children: left }}
      center={{
        as: 'main',
        panelProps: { id: 'book-main', tabIndex: -1, 'aria-label': 'Book a call' },
        children: center,
      }}
      right={{ as: 'aside', panelProps: { 'aria-label': 'What to expect' }, children: right }}
    />
  );
}
