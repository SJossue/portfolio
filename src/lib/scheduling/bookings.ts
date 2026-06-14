import { getSql } from '@/lib/db';
import type { Interval } from './types';

export interface BookingRow {
  id: string;
  meeting_type_id: string;
  start_utc: string;
  end_utc: string;
  invitee_name: string;
  invitee_email: string;
  invitee_timezone: string;
  notes: string | null;
  google_event_id: string | null;
  status: string;
  cancel_token: string;
}

export async function findConfirmedBetween(from: Date, to: Date): Promise<Interval[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT start_utc, end_utc FROM bookings
    WHERE status = 'confirmed'
      AND start_utc < ${to.toISOString()}
      AND end_utc > ${from.toISOString()}
  `) as { start_utc: string; end_utc: string }[];
  return rows.map((r) => ({ start: new Date(r.start_utc), end: new Date(r.end_utc) }));
}

/**
 * Insert a confirmed booking. Throws on the exclusion-constraint violation
 * (slot already taken) so the caller can return a 409.
 */
export async function reserve(input: {
  meetingTypeId: string;
  startUtc: string;
  endUtc: string;
  name: string;
  email: string;
  timezone: string;
  notes?: string;
}): Promise<BookingRow> {
  const sql = getSql();
  const rows = (await sql`
    INSERT INTO bookings
      (meeting_type_id, start_utc, end_utc, invitee_name, invitee_email, invitee_timezone, notes)
    VALUES
      (${input.meetingTypeId}, ${input.startUtc}, ${input.endUtc}, ${input.name},
       ${input.email}, ${input.timezone}, ${input.notes ?? null})
    RETURNING *
  `) as BookingRow[];
  return rows[0];
}

export function isOverlapError(e: unknown): boolean {
  return e instanceof Error && /no_overlap|exclusion|conflicting key/i.test(e.message);
}
