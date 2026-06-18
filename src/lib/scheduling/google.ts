import { JWT } from 'google-auth-library';
import type { Interval } from './types';

const CAL_BASE = 'https://www.googleapis.com/calendar/v3';
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

/** True when the service-account env is present. When false, callers no-op. */
export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON && process.env.GOOGLE_CALENDAR_ID);
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

function loadCredentials(): ServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON ?? '';
  // Accept either base64-encoded JSON or raw JSON.
  let text = raw.trim();
  if (!text.startsWith('{')) {
    text = Buffer.from(text, 'base64').toString('utf8');
  }
  const parsed = JSON.parse(text) as ServiceAccount;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON missing client_email/private_key');
  }
  return parsed;
}

let _client: JWT | null = null;

async function authHeader(): Promise<Record<string, string>> {
  if (!_client) {
    const creds = loadCredentials();
    _client = new JWT({ email: creds.client_email, key: creds.private_key, scopes: SCOPES });
  }
  const { token } = await _client.getAccessToken();
  if (!token) throw new Error('failed to obtain Google access token');
  return { authorization: `Bearer ${token}` };
}

function calendarId(): string {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new Error('GOOGLE_CALENDAR_ID is not set');
  return id;
}

interface FreeBusyResponse {
  calendars?: Record<string, { busy?: { start: string; end: string }[] }>;
}

/** Pure: turn a freeBusy API response into Interval[] for a calendar id. */
export function parseFreeBusy(json: FreeBusyResponse, calId: string): Interval[] {
  const busy = json.calendars?.[calId]?.busy ?? [];
  return busy.map((b) => ({ start: new Date(b.start), end: new Date(b.end) }));
}

/** Busy intervals on the owner's calendar between two instants. */
export async function getBusy(timeMin: Date, timeMax: Date): Promise<Interval[]> {
  const calId = calendarId();
  const res = await fetch(`${CAL_BASE}/freeBusy`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: calId }],
    }),
  });
  if (!res.ok) throw new Error(`freeBusy failed: ${res.status}`);
  const json = (await res.json()) as FreeBusyResponse;
  return parseFreeBusy(json, calId);
}

interface CreateEventInput {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendeeEmail: string;
  attendeeName?: string;
  location?: string;
}

/** Create an event on the owner's calendar; returns the Google event id. */
export async function createEvent(input: CreateEventInput): Promise<string> {
  // NOTE: we intentionally do NOT set `attendees`. A service account cannot
  // invite attendees without domain-wide delegation (403 forbiddenForService
  // Accounts), and we don't need it to — Resend emails the .ics invite to the
  // visitor. The booker's identity goes in the description so the owner sees it.
  const guest = input.attendeeName
    ? `${input.attendeeName} <${input.attendeeEmail}>`
    : input.attendeeEmail;
  const description = [input.description, `Booked by: ${guest}`].filter(Boolean).join('\n\n');

  const res = await fetch(
    `${CAL_BASE}/calendars/${encodeURIComponent(calendarId())}/events?sendUpdates=none`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify({
        summary: input.summary,
        description,
        location: input.location,
        start: { dateTime: input.start.toISOString() },
        end: { dateTime: input.end.toISOString() },
      }),
    },
  );
  if (!res.ok) throw new Error(`event insert failed: ${res.status}`);
  const json = (await res.json()) as { id?: string };
  if (!json.id) throw new Error('event insert returned no id');
  return json.id;
}

/** Move an existing event to a new time. */
export async function updateEventTime(eventId: string, start: Date, end: Date): Promise<void> {
  const res = await fetch(
    `${CAL_BASE}/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
    {
      method: 'PATCH',
      headers: { 'content-type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify({
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      }),
    },
  );
  if (!res.ok) throw new Error(`event patch failed: ${res.status}`);
}

/** Delete an event by id. Swallows 404/410 (already gone). */
export async function deleteEvent(eventId: string): Promise<void> {
  const res = await fetch(
    `${CAL_BASE}/calendars/${encodeURIComponent(calendarId())}/events/${encodeURIComponent(eventId)}?sendUpdates=none`,
    { method: 'DELETE', headers: { ...(await authHeader()) } },
  );
  if (!res.ok && res.status !== 404 && res.status !== 410) {
    throw new Error(`event delete failed: ${res.status}`);
  }
}
