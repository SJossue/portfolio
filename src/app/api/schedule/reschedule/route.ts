import { addMinutes } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { meetingTypeById } from '@/content/scheduling';
import { findByToken, isOverlapError, rescheduleByToken } from '@/lib/scheduling/bookings';
import { sendRescheduleEmails } from '@/lib/scheduling/email';
import { isGoogleConfigured, updateEventTime } from '@/lib/scheduling/google';
import { isZoomConfigured, updateZoomMeeting } from '@/lib/scheduling/zoom';
import { checkRateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function clientIp(req: NextRequest): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}

export async function POST(req: NextRequest) {
  const limit = checkRateLimit(clientIp(req));
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'too many requests' },
      {
        status: 429,
        headers: { 'retry-after': String(Math.ceil((limit.retryAfterMs ?? 60_000) / 1000)) },
      },
    );
  }

  let token = '';
  let startUtc = '';
  try {
    const b = (await req.json()) as { token?: string; startUtc?: string };
    token = b.token ?? '';
    startUtc = b.startUtc ?? '';
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  if (!token || !startUtc) return NextResponse.json({ error: 'missing fields' }, { status: 400 });

  const newStart = new Date(startUtc);
  if (Number.isNaN(newStart.getTime()) || newStart.getTime() < Date.now())
    return NextResponse.json({ error: 'invalid or past slot' }, { status: 400 });

  try {
    const existing = await findByToken(token);
    if (!existing || existing.status !== 'confirmed')
      return NextResponse.json({ error: 'booking not found' }, { status: 404 });

    const type = meetingTypeById(existing.meeting_type_id);
    if (!type) return NextResponse.json({ error: 'unknown meeting type' }, { status: 400 });

    const oldStart = new Date(existing.start_utc);
    const newEnd = addMinutes(newStart, type.durationMin);

    let updated;
    try {
      updated = await rescheduleByToken(token, newStart.toISOString(), newEnd.toISOString());
    } catch (e) {
      if (isOverlapError(e))
        return NextResponse.json({ error: 'slot just got taken' }, { status: 409 });
      throw e;
    }
    if (!updated) return NextResponse.json({ error: 'booking not found' }, { status: 404 });

    // Move the calendar event + Zoom meeting (best-effort; the email + .ics
    // carry the authoritative new time regardless).
    if (updated.google_event_id && isGoogleConfigured())
      await updateEventTime(updated.google_event_id, newStart, newEnd).catch(() => {});
    if (updated.video_meeting_id && isZoomConfigured())
      await updateZoomMeeting(
        updated.video_meeting_id,
        newStart,
        type.durationMin,
        updated.invitee_timezone,
      ).catch(() => {});

    try {
      await sendRescheduleEmails({
        meetingType: type,
        oldStart,
        newStart,
        newEnd,
        inviteeName: updated.invitee_name,
        inviteeEmail: updated.invitee_email,
        inviteeTimezone: updated.invitee_timezone,
        bookingId: updated.id,
        cancelToken: updated.cancel_token,
        videoUrl: updated.video_url ?? undefined,
      });
    } catch {
      // Reschedule already persisted; email failure shouldn't error the user.
    }

    return NextResponse.json({ ok: true, startUtc: newStart.toISOString() });
  } catch {
    return NextResponse.json({ error: 'could not reschedule' }, { status: 503 });
  }
}
