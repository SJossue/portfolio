import { addMinutes } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { meetingTypeById } from '@/content/scheduling';
import { isOverlapError, reserve } from '@/lib/scheduling/bookings';
import { sendConfirmationEmails } from '@/lib/scheduling/email';
import type { BookingInput } from '@/lib/scheduling/types';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
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
