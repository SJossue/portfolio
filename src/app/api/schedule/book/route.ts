import { addMinutes } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { meetingTypeById } from '@/content/scheduling';
import { isOverlapError, remove, reserve, setGoogleEventId } from '@/lib/scheduling/bookings';
import { sendConfirmationEmails } from '@/lib/scheduling/email';
import { createEvent, isGoogleConfigured } from '@/lib/scheduling/google';
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

    // Write the event onto the owner's calendar. If it fails, roll the
    // reservation back so the slot frees up — no phantom bookings.
    if (isGoogleConfigured()) {
      try {
        const eventId = await createEvent({
          summary: `${type.name} with ${siteConfig.author}`,
          description: row.notes ?? '',
          start,
          end,
          attendeeEmail: row.invitee_email,
          attendeeName: row.invitee_name,
        });
        await setGoogleEventId(row.id, eventId);
      } catch {
        await remove(row.id).catch(() => {});
        return NextResponse.json({ error: 'could not reach calendar, try again' }, { status: 503 });
      }
    }

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
      });
    } catch {
      // Booking is saved; an email failure shouldn't 500 the visitor.
    }

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch (e) {
    if (isOverlapError(e))
      return NextResponse.json({ error: 'slot just got taken' }, { status: 409 });
    return NextResponse.json({ error: 'could not book' }, { status: 503 });
  }
}
