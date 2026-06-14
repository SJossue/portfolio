import { expect, it } from 'vitest';
import { parseFreeBusy } from './google';

const CAL = 'owner@jossue.dev';

it('extracts busy intervals for the calendar', () => {
  const intervals = parseFreeBusy(
    {
      calendars: {
        [CAL]: {
          busy: [
            { start: '2026-06-17T14:00:00Z', end: '2026-06-17T14:30:00Z' },
            { start: '2026-06-17T16:00:00Z', end: '2026-06-17T17:00:00Z' },
          ],
        },
      },
    },
    CAL,
  );
  expect(intervals).toHaveLength(2);
  expect(intervals[0].start.toISOString()).toBe('2026-06-17T14:00:00.000Z');
  expect(intervals[1].end.toISOString()).toBe('2026-06-17T17:00:00.000Z');
});

it('returns [] when the calendar has no busy data', () => {
  expect(parseFreeBusy({ calendars: {} }, CAL)).toEqual([]);
  expect(parseFreeBusy({}, CAL)).toEqual([]);
});
