import { NextRequest, NextResponse } from 'next/server';
import { meetingTypeById } from '@/content/scheduling';
import { findDueForReminder, markReminded } from '@/lib/scheduling/bookings';
import { sendReminderEmail } from '@/lib/scheduling/email';

export const runtime = 'nodejs';
// Don't cache — this must run fresh on every cron invocation.
export const dynamic = 'force-dynamic';

/**
 * Daily cron: email a reminder for every confirmed booking happening in the
 * next ~24-48h that hasn't been reminded yet. Vercel attaches
 * `Authorization: Bearer $CRON_SECRET` when CRON_SECRET is set; we verify it.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let sent = 0;
  let failed = 0;
  try {
    const due = await findDueForReminder();
    for (const row of due) {
      const type = meetingTypeById(row.meeting_type_id);
      if (!type) continue;
      try {
        await sendReminderEmail({
          meetingType: type,
          start: new Date(row.start_utc),
          inviteeName: row.invitee_name,
          inviteeEmail: row.invitee_email,
          inviteeTimezone: row.invitee_timezone,
          cancelToken: row.cancel_token,
          videoUrl: row.video_url ?? undefined,
        });
        await markReminded(row.id);
        sent += 1;
      } catch {
        // Leave reminded_at null so the next run retries this one.
        failed += 1;
      }
    }
    return NextResponse.json({ ok: true, sent, failed });
  } catch {
    return NextResponse.json({ error: 'reminder run failed' }, { status: 503 });
  }
}
