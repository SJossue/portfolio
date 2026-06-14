import { expect, it } from 'vitest';
import { getAvailableSlots } from './availability';
import type { AvailabilityRules } from './types';

const rules: AvailabilityRules = {
  ownerTimezone: 'America/New_York',
  windows: [{ weekday: 3, start: '10:00', end: '12:00' }], // Wednesdays 10–12 ET
  slotGranularityMin: 30,
  minNoticeMin: 0,
  horizonDays: 30,
  bufferBeforeMin: 0,
  bufferAfterMin: 0,
};

// Wed 2026-06-17 is a Wednesday.
const from = new Date('2026-06-15T00:00:00Z');
const to = new Date('2026-06-21T00:00:00Z');
const now = new Date('2026-06-15T00:00:00Z');

it('generates 30-min slots inside the weekly window', () => {
  const slots = getAvailableSlots({ durationMin: 30, rules, busy: [], from, to, now });
  // 10:00,10:30,11:00,11:30 ET on Wed -> 4 slots
  expect(slots).toHaveLength(4);
  // 10:00 ET = 14:00 UTC (EDT, -4)
  expect(slots[0].startUtc).toBe('2026-06-17T14:00:00.000Z');
});

it('drops slots overlapping a busy interval (incl. duration)', () => {
  const slots = getAvailableSlots({
    durationMin: 30,
    rules,
    busy: [{ start: new Date('2026-06-17T14:15:00Z'), end: new Date('2026-06-17T14:45:00Z') }],
    from,
    to,
    now,
  });
  // 10:00 (14:00-14:30) overlaps; 10:30 (14:30-15:00) overlaps -> 2 remain
  expect(slots.map((s) => s.startUtc)).toEqual([
    '2026-06-17T15:00:00.000Z',
    '2026-06-17T15:30:00.000Z',
  ]);
});

it('respects minNotice', () => {
  const slots = getAvailableSlots({
    durationMin: 30,
    rules: { ...rules, minNoticeMin: 60 },
    busy: [],
    from,
    to,
    now: new Date('2026-06-17T14:15:00Z'), // 10:15 ET
  });
  // earliest bookable is now+60min = 15:15 UTC -> only 11:30 (15:30) survives
  expect(slots.map((s) => s.startUtc)).toEqual(['2026-06-17T15:30:00.000Z']);
});

it('respects horizonDays', () => {
  const slots = getAvailableSlots({
    durationMin: 30,
    rules: { ...rules, horizonDays: 1 },
    busy: [],
    from,
    to,
    now,
  });
  expect(slots).toHaveLength(0); // Wed 6/17 is > 1 day after now (6/15)
});
