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
  video_url: string | null;
  video_meeting_id: string | null;
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

/** Attach the Google event id + (optional) video link after the writes succeed. */
export async function setEventDetails(
  id: string,
  details: {
    googleEventId?: string | null;
    videoUrl?: string | null;
    videoMeetingId?: string | null;
  },
): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE bookings
    SET google_event_id = ${details.googleEventId ?? null},
        video_url = ${details.videoUrl ?? null},
        video_meeting_id = ${details.videoMeetingId ?? null}
    WHERE id = ${id}
  `;
}

/** Hard-delete a booking row — used to roll back a failed reservation. */
export async function remove(id: string): Promise<void> {
  const sql = getSql();
  await sql`DELETE FROM bookings WHERE id = ${id}`;
}

/** Look up a confirmed booking by its cancel token. */
export async function findByToken(token: string): Promise<BookingRow | null> {
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM bookings WHERE cancel_token = ${token} LIMIT 1
  `) as BookingRow[];
  return rows[0] ?? null;
}

/** Mark a booking cancelled (frees the slot via the partial exclusion index). */
export async function cancelByToken(token: string): Promise<BookingRow | null> {
  const sql = getSql();
  const rows = (await sql`
    UPDATE bookings SET status = 'cancelled'
    WHERE cancel_token = ${token} AND status = 'confirmed'
    RETURNING *
  `) as BookingRow[];
  return rows[0] ?? null;
}
