import { addDays, addMinutes } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import type { AvailabilityRules, Interval, Slot } from './types';

interface Params {
  durationMin: number;
  rules: AvailabilityRules;
  busy: Interval[];
  from: Date;
  to: Date;
  now: Date;
}

function overlaps(aStart: Date, aEnd: Date, b: Interval): boolean {
  return aStart < b.end && b.start < aEnd;
}

export function getAvailableSlots({ durationMin, rules, busy, from, to, now }: Params): Slot[] {
  const slots: Slot[] = [];
  const earliest = addMinutes(now, rules.minNoticeMin);
  const latest = addDays(now, rules.horizonDays);

  // Walk each calendar day in the owner's timezone across [from, to].
  for (let cursor = new Date(from); cursor <= to; cursor = addDays(cursor, 1)) {
    const zoned = toZonedTime(cursor, rules.ownerTimezone);
    const weekday = zoned.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    const windows = rules.windows.filter((w) => w.weekday === weekday);

    for (const w of windows) {
      const [sh, sm] = w.start.split(':').map(Number);
      const [eh, em] = w.end.split(':').map(Number);
      const y = zoned.getFullYear();
      const mo = zoned.getMonth();
      const d = zoned.getDate();

      // Build window edges as UTC instants from owner-local wall time.
      const windowStart = fromZonedTime(new Date(y, mo, d, sh, sm), rules.ownerTimezone);
      const windowEnd = fromZonedTime(new Date(y, mo, d, eh, em), rules.ownerTimezone);

      for (
        let slotStart = windowStart;
        addMinutes(slotStart, durationMin) <= windowEnd;
        slotStart = addMinutes(slotStart, rules.slotGranularityMin)
      ) {
        const slotEnd = addMinutes(slotStart, durationMin);
        const guardStart = addMinutes(slotStart, -rules.bufferBeforeMin);
        const guardEnd = addMinutes(slotEnd, rules.bufferAfterMin);

        if (slotStart < earliest) continue;
        if (slotStart > latest) continue;
        if (busy.some((b) => overlaps(guardStart, guardEnd, b))) continue;

        slots.push({ startUtc: slotStart.toISOString(), endUtc: slotEnd.toISOString() });
      }
    }
  }

  // De-dup + sort (windows on the same day could theoretically overlap).
  const seen = new Set<string>();
  return slots
    .filter((s) => (seen.has(s.startUtc) ? false : seen.add(s.startUtc)))
    .sort((a, b) => a.startUtc.localeCompare(b.startUtc));
}
