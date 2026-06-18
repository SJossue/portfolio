import { addMinutes } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { meetingTypeById } from '@/content/scheduling';
import { isOverlapError, remove, reserve, setEventDetails } from '@/lib/scheduling/bookings';
import { sendConfirmationEmails } from '@/lib/scheduling/email';
import { createEvent, isGoogleConfigured } from '@/lib/scheduling/google';
import { createZoomMeeting, deleteZoomMeeting, isZoomConfigured } from '@/lib/scheduling/zoom';
import { checkRateLimit } from '@/lib/rate-limit';
import { siteConfig } from '@/lib/site';
import type { BookingInput } from '@/lib/scheduling/types';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  let body: BookingInput;
  try {
    body = (await req.json()) as BookingInput;
  } catch {
    return NextResponse.json({ error: 'invalid json' }, { status: 400 });
  }

  const type = meetingTypeById(body.meetingTypeId);
  if (!type) return NextResponse.json({ error: 'unknown meeting type' }, { status: 400 });
  if (!body.name?.trim() || !EMAIL_RE.test(body.email ?? ''))
    return NextResponse.json({ error: 'name and valid email required' }, { status: 400 });

  const start = new Date(body.startUtc);
  if (Number.isNaN(start.getTime()) || start.getTime() < Date.now())
    return NextResponse.json({ error: 'invalid or past slot' }, { status: 400 });
  const end = addMinutes(start, type.durationMin);

  try {
    const row = await reserve({
      meetingTypeId: type.id,
      startUtc: start.toISOString(),
      endUtc: end.toISOString(),
      name: body.name.trim(),
      email: body.email.trim(),
      timezone: body.timezone || 'UTC',
      notes: body.notes?.trim(),
    });

    // Create the Zoom meeting first so its link can ride along on the event +
    // email. Non-fatal: a Zoom hiccup shouldn't sink the booking.
    let videoUrl: string | undefined;
    let videoMeetingId: string | undefined;
    if (isZoomConfigured()) {
      try {
        const meeting = await createZoomMeeting({
          topic: `${type.name} with ${siteConfig.author}`,
          start,
          durationMin: type.durationMin,
          timezone: row.invitee_timezone,
        });
        videoUrl = meeting.joinUrl;
        videoMeetingId = meeting.id;
      } catch {
        // proceed without a link
      }
    }

    // Write the event onto the owner's calendar. If it fails, roll the
    // reservation (and any Zoom meeting) back — no phantom bookings.
    let eventId: string | undefined;
    if (isGoogleConfigured()) {
      try {
        eventId = await createEvent({
          summary: `${type.name} with ${siteConfig.author}`,
          description: [row.notes, videoUrl ? `Join: ${videoUrl}` : '']
            .filter(Boolean)
            .join('\n\n'),
          start,
          end,
          attendeeEmail: row.invitee_email,
          attendeeName: row.invitee_name,
          location: videoUrl,
        });
      } catch {
        if (videoMeetingId) await deleteZoomMeeting(videoMeetingId).catch(() => {});
        await remove(row.id).catch(() => {});
        return NextResponse.json({ error: 'could not reach calendar, try again' }, { status: 503 });
      }
    }

    await setEventDetails(row.id, { googleEventId: eventId, videoUrl, videoMeetingId }).catch(
      () => {},
    );

    try {
      await sendConfirmationEmails({
        meetingType: type,
        start,
        end,
        inviteeName: row.invitee_name,
        inviteeEmail: row.invitee_email,
        inviteeTimezone: row.invitee_timezone,
        notes: row.notes ?? undefined,
        bookingId: row.id,
        cancelToken: row.cancel_token,
        videoUrl,
      });
    } catch {
      // Booking is saved; an email failure shouldn't 500 the visitor.
    }

    return NextResponse.json({ ok: true, id: row.id, videoUrl }, { status: 201 });
  } catch (e) {
    if (isOverlapError(e))
      return NextResponse.json({ error: 'slot just got taken' }, { status: 409 });
    return NextResponse.json({ error: 'could not book' }, { status: 503 });
  }
}
