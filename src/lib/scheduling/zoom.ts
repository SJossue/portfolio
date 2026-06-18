/**
 * Zoom Server-to-Server OAuth integration. Creates a real Zoom meeting per
 * booking and returns its join URL. No-ops gracefully when unconfigured.
 */

const OAUTH_URL = 'https://zoom.us/oauth/token';
const API_BASE = 'https://api.zoom.us/v2';

export function isZoomConfigured(): boolean {
  return Boolean(
    process.env.ZOOM_ACCOUNT_ID && process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET,
  );
}

let cachedToken: { value: string; expiresAt: number } | null = null;

async function getToken(): Promise<string> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) return cachedToken.value;

  const basic = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`,
  ).toString('base64');

  const res = await fetch(
    `${OAUTH_URL}?grant_type=account_credentials&account_id=${encodeURIComponent(process.env.ZOOM_ACCOUNT_ID ?? '')}`,
    { method: 'POST', headers: { authorization: `Basic ${basic}` } },
  );
  if (!res.ok) throw new Error(`zoom token failed: ${res.status}`);
  const json = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    value: json.access_token,
    expiresAt: Date.now() + json.expires_in * 1000,
  };
  return json.access_token;
}

export interface ZoomMeeting {
  id: string;
  joinUrl: string;
}

export interface CreateZoomInput {
  topic: string;
  start: Date;
  durationMin: number;
  timezone: string;
}

/** Create a scheduled Zoom meeting; returns its id + join URL. */
export async function createZoomMeeting(input: CreateZoomInput): Promise<ZoomMeeting> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/users/me/meetings`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({
      topic: input.topic,
      type: 2, // scheduled meeting
      start_time: input.start.toISOString().replace(/\.\d{3}Z$/, 'Z'),
      duration: input.durationMin,
      timezone: input.timezone,
      settings: { join_before_host: true, waiting_room: false },
    }),
  });
  if (!res.ok) throw new Error(`zoom create failed: ${res.status}`);
  const json = (await res.json()) as { id: number; join_url: string };
  return { id: String(json.id), joinUrl: json.join_url };
}

/** Delete a Zoom meeting by id. Swallows 404 (already gone). */
export async function deleteZoomMeeting(meetingId: string): Promise<void> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}/meetings/${encodeURIComponent(meetingId)}`, {
    method: 'DELETE',
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 404) throw new Error(`zoom delete failed: ${res.status}`);
}
