'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { meetingTypeById } from '@/content/scheduling';
import { Card } from '@/components/ui/Card';
import { siteConfig } from '@/lib/site';
import type { Slot } from '@/lib/scheduling/types';
import { BookingForm } from './BookingForm';
import { Confirmation } from './Confirmation';
import { groupByDay, longDayLabel, timeLabel } from './format';
import { ArrowLeft, GlobeIcon } from './icons';
import { MeetingTypePicker } from './MeetingTypePicker';
import { MonthCalendar } from './MonthCalendar';
import { SlotList } from './SlotList';
import { SummaryRail } from './SummaryRail';
import { useBooking } from './store';
import { detectTimezone, offsetLabel, timezoneOptions } from './timezone';

function prettyTz(tz: string) {
  return tz.replace(/_/g, ' ');
}

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

  const TimezoneSelect = (
    <label className="mt-5 flex items-center gap-2 text-sm text-slate-400">
      <GlobeIcon className="h-4 w-4 text-slate-500" />
      <span className="sr-only">Timezone</span>
      <select
        value={timezone}
        onChange={(e) => setTimezone(e.target.value)}
        className="max-w-full rounded-md border border-white/10 bg-transparent py-1 text-sm text-slate-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400/40"
      >
        {timezoneOptions(detected).map((tz) => (
          <option key={tz} value={tz} className="bg-[#0d0d14]">
            {prettyTz(tz)} ({offsetLabel(tz)})
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <Card className="w-full max-w-3xl overflow-hidden">
      {step !== 'done' && step !== 'type' ? (
        <div className="border-b border-white/10 px-6 py-3">
          <button
            onClick={back}
            className="inline-flex items-center gap-1.5 rounded text-sm text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      ) : null}

      <div className="p-6 sm:p-8">
        {/* Step 1 — choose a meeting type */}
        {step === 'type' && (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/15 text-sm font-semibold text-cyan-300"
                aria-hidden
              >
                JS
              </span>
              <div>
                <h1 className="text-lg font-semibold text-white">Book a call with Jossue</h1>
                <p className="text-sm text-slate-400">Pick what works — pick a time — done.</p>
              </div>
            </div>
            <MeetingTypePicker onSelect={selectType} />
          </div>
        )}

        {/* Step 2 — date & time */}
        {step === 'schedule' && (
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            <div className="md:border-r md:border-white/10 md:pr-8">
              <SummaryRail meetingType={selectedType ?? null} dayLabel={null} timeLabel={null} />
            </div>
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">Select a date &amp; time</h2>
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
                  {TimezoneSelect}
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
          </div>
        )}

        {/* Step 3 — details */}
        {step === 'details' && selectedType && slotUtc && (
          <div className="grid gap-8 md:grid-cols-[240px_1fr]">
            <div className="md:border-r md:border-white/10 md:pr-8">
              <SummaryRail
                meetingType={selectedType}
                dayLabel={railDayLabel}
                timeLabel={railTimeLabel}
              />
            </div>
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

        {/* Step 4 — confirmation */}
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

      {step === 'type' ? (
        <div className="border-t border-white/10 px-6 py-3 text-center text-xs text-slate-500">
          Powered by {siteConfig.name}&apos;s own scheduler
        </div>
      ) : null}
    </Card>
  );
}
