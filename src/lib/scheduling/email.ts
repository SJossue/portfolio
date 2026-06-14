import { Resend } from 'resend';
import { siteConfig } from '@/lib/site';
import { buildIcs } from './ics';
import type { MeetingType } from './types';

interface ConfirmInput {
  meetingType: MeetingType;
  start: Date;
  end: Date;
  inviteeName: string;
  inviteeEmail: string;
  inviteeTimezone: string;
  notes?: string;
  bookingId: string;
  cancelToken: string;
}

function fmt(d: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: tz,
  }).format(d);
}

const FROM = `${siteConfig.author} <booking@jossue.dev>`;

export async function sendConfirmationEmails(i: ConfirmInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const owner = process.env.OWNER_EMAIL;
  if (!apiKey || !owner) throw new Error('RESEND_API_KEY or OWNER_EMAIL not set');
  const resend = new Resend(apiKey);

  const ics = buildIcs({
    uid: i.bookingId,
    start: i.start,
    end: i.end,
    summary: `${i.meetingType.name} with ${siteConfig.author}`,
    description: i.notes ?? '',
    organizerEmail: owner,
    attendeeEmail: i.inviteeEmail,
  });
  const attachments = [{ filename: 'invite.ics', content: Buffer.from(ics).toString('base64') }];
  const cancelUrl = `${siteConfig.url}/book/cancel?token=${i.cancelToken}`;

  await resend.emails.send({
    from: FROM,
    to: i.inviteeEmail,
    subject: `Confirmed: ${i.meetingType.name} with ${siteConfig.author}`,
    text: [
      `You're booked for a ${i.meetingType.name}.`,
      ``,
      `${fmt(i.start, i.inviteeTimezone)} (${i.inviteeTimezone})`,
      ``,
      `Need to cancel? ${cancelUrl}`,
    ].join('\n'),
    attachments,
  });

  await resend.emails.send({
    from: FROM,
    to: owner,
    subject: `New booking: ${i.meetingType.name} — ${i.inviteeName}`,
    text: [
      `${i.inviteeName} (${i.inviteeEmail}) booked a ${i.meetingType.name}.`,
      ``,
      `${fmt(i.start, process.env.OWNER_TIMEZONE ?? 'America/New_York')}`,
      ``,
      `Notes: ${i.notes ?? '—'}`,
    ].join('\n'),
    attachments,
  });
}
