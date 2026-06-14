import { addDays } from 'date-fns';
import { NextRequest, NextResponse } from 'next/server';
import { availabilityRules, meetingTypeById } from '@/content/scheduling';
import { getAvailableSlots } from '@/lib/scheduling/availability';
import { findConfirmedBetween } from '@/lib/scheduling/bookings';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeId = searchParams.get('type') ?? '';
  const type = meetingTypeById(typeId);
  if (!type) return NextResponse.json({ error: 'unknown meeting type' }, { status: 400 });

  const from = new Date();
  const to = addDays(from, availabilityRules.horizonDays);

  try {
    const busy = await findConfirmedBetween(from, to);
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
