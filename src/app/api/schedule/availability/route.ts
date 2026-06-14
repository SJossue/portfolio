import { addDays } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { availabilityRules, meetingTypeById } from '@/content/scheduling';
import { getAvailableSlots } from '@/lib/scheduling/availability';
import { findConfirmedBetween } from '@/lib/scheduling/bookings';
import { getBusy, isGoogleConfigured } from '@/lib/scheduling/google';
import type { Interval } from '@/lib/scheduling/types';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('type') ?? '';
  const type = meetingTypeById(typeId);
  if (!type) return NextResponse.json({ error: 'unknown meeting type' }, { status: 400 });

  const from = new Date();
  const to = addDays(from, availabilityRules.horizonDays);

  try {
    // Busy = confirmed DB bookings + (if configured) the owner's Google calendar.
    const sources: Promise<Interval[]>[] = [findConfirmedBetween(from, to)];
    if (isGoogleConfigured()) {
      // A Google outage must not take down booking; degrade to DB-only.
      sources.push(getBusy(from, to).catch(() => []));
    }
    const busy = (await Promise.all(sources)).flat();

    const slots = getAvailableSlots({
      durationMin: type.durationMin,
      rules: availabilityRules,
      busy,
      from,
      to,
      now: from,
    });
    return NextResponse.json({ slots });
  } catch {
    return NextResponse.json({ error: 'availability unavailable' }, { status: 503 });
  }
}
