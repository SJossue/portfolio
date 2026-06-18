import { NextRequest, NextResponse } from 'next/server';
import { meetingTypeById } from '@/content/scheduling';
import { cancelByToken, findByToken } from '@/lib/scheduling/bookings';
import { sendCancellationEmails } from '@/lib/scheduling/email';
import { deleteEvent, isGoogleConfigured } from '@/lib/scheduling/google';
import { deleteZoomMeeting, isZoomConfigured } from '@/lib/scheduling/zoom';

export const runtime = 'nodejs';

/** Look up a booking by cancel token (to render the cancel page). */
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token') ?? '';
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 });

  try {
    const row = await findByToken(token);
    if (!row) return NextResponse.json({ error: 'not found' }, { status: 404 });
    const type = meetingTypeById(row.meeting_type_id);
    return NextResponse.json({
      meetingTypeId: row.meeting_type_id,
      meetingTypeName: type?.name ?? row.meeting_type_id,
      startUtc: row.start_utc,
      inviteeName: row.invitee_name,
      inviteeTimezone: row.invitee_timezone,
      status: row.status,
    });
  } catch {
    return NextResponse.json({ error: 'lookup failed' }, { status: 503 });
  }
}

/** Cancel a booking: mark cancelled, delete the calendar event, email both sides. */
export async function POST(req: NextRequest) {
  let token = '';
  try {
    token = ((await req.json()) as { token?: string }).token ?? '';
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }
  if (!token) return NextResponse.json({ error: 'missing token' }, { status: 400 });

  try {
    const row = await cancelByToken(token);
    if (!row)
      return NextResponse.json({ error: 'already cancelled or not found' }, { status: 404 });

    if (row.google_event_id && isGoogleConfigured()) {
      await deleteEvent(row.google_event_id).catch(() => {});
    }
    if (row.video_meeting_id && isZoomConfigured()) {
      await deleteZoomMeeting(row.video_meeting_id).catch(() => {});
    }

    const type = meetingTypeById(row.meeting_type_id);
    try {
      await sendCancellationEmails({
        meetingTypeName: type?.name ?? row.meeting_type_id,
        start: new Date(row.start_utc),
        inviteeName: row.invitee_name,
        inviteeEmail: row.invitee_email,
        inviteeTimezone: row.invitee_timezone,
      });
    } catch {
      // Cancellation already persisted; email failure shouldn't error the user.
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'could not cancel' }, { status: 503 });
  }
}
