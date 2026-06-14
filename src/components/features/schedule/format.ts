import { formatInTimeZone } from 'date-fns-tz';
import type { Slot } from '@/lib/scheduling/types';

/** YYYY-MM-DD key for a slot in the visitor's timezone. */
export function dayKeyOf(iso: string, tz: string): string {
  return formatInTimeZone(new Date(iso), tz, 'yyyy-MM-dd');
}

/** "9:30 AM" in the visitor's timezone. */
export function timeLabel(iso: string, tz: string): string {
  return formatInTimeZone(new Date(iso), tz, 'h:mm a');
}

/** "Wednesday, June 17" in the visitor's timezone. */
export function longDayLabel(iso: string, tz: string): string {
  return formatInTimeZone(new Date(iso), tz, 'EEEE, MMMM d');
}

/** Group slots by their visitor-tz day key. */
export function groupByDay(slots: Slot[], tz: string): Map<string, Slot[]> {
  const map = new Map<string, Slot[]>();
  for (const slot of slots) {
    const key = dayKeyOf(slot.startUtc, tz);
    const bucket = map.get(key);
    if (bucket) bucket.push(slot);
    else map.set(key, [slot]);
  }
  return map;
}
