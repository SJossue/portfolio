import { Resend } from 'resend';
import { siteConfig } from '@/lib/site';
import { buildIcs } from './ics';
import type { MeetingType } from './types';

const FROM = `${siteConfig.author} <booking@jossue.dev>`;
const ACCENT = '#0891b2';
const INK = '#0f172a';
const MUTED = '#64748b';

function fmt(d: Date, tz: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: tz,
  }).format(d);
}

/** Email-safe HTML shell: centered card, dark header, light body. */
function shell(preheader: string, body: string): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;font-family:'Segoe UI',Helvetica,Arial,sans-serif;box-shadow:0 8px 30px rgba(2,6,23,0.08);">
<tr><td style="background:#0d0d14;padding:20px 28px;">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="background:rgba(8,145,178,0.18);color:#67e8f9;font-weight:700;font-size:14px;width:36px;height:36px;border-radius:18px;text-align:center;vertical-align:middle;">JS</td>
<td style="padding-left:12px;color:#e2e8f0;font-size:14px;letter-spacing:0.04em;">jossue.dev</td>
</tr></table>
</td></tr>
<tr><td style="padding:32px 28px;">${body}</td></tr>
<tr><td style="padding:18px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:${MUTED};font-size:12px;">
Booked through ${siteConfig.author}&rsquo;s scheduler at jossue.dev
</td></tr>
</table>
</td></tr></table></body></html>`;
}

function detailsTable(rows: [string, string][]): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;margin:8px 0 4px;">
${rows
  .map(
    ([label, value], i) =>
      `<tr><td style="padding:12px 16px;${i ? 'border-top:1px solid #f1f5f9;' : ''}color:${MUTED};font-size:13px;width:90px;">${label}</td>
<td style="padding:12px 16px;${i ? 'border-top:1px solid #f1f5f9;' : ''}color:${INK};font-size:14px;font-weight:600;">${value}</td></tr>`,
  )
  .join('')}
</table>`;
}

function joinButton(url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0;"><tr>
<td style="border-radius:10px;background:${ACCENT};">
<a href="${url}" style="display:inline-block;padding:13px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;font-family:'Segoe UI',Helvetica,Arial,sans-serif;">Join the Zoom call</a>
</td></tr></table>
<p style="margin:0 0 4px;color:${MUTED};font-size:12px;word-break:break-all;">Or paste this link: <a href="${url}" style="color:${ACCENT};">${url}</a></p>`;
}

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
  videoUrl?: string;
}

/** Pure: the invitee confirmation email HTML. Exported for previews/tests. */
export function renderInviteeConfirmation(i: ConfirmInput): string {
  const cancelUrl = `${siteConfig.url}/book/cancel?token=${i.cancelToken}`;
  const body = `
<p style="margin:0 0 6px;color:${ACCENT};font-size:13px;font-weight:600;letter-spacing:0.06em;">YOU&rsquo;RE BOOKED</p>
<h1 style="margin:0 0 8px;color:${INK};font-size:24px;">See you soon, ${i.inviteeName.split(' ')[0]}.</h1>
<p style="margin:0 0 16px;color:${MUTED};font-size:14px;line-height:1.6;">Your ${i.meetingType.name.toLowerCase()} with ${siteConfig.author} is confirmed. The details are below and a calendar invite is attached.</p>
${detailsTable([
  ['Meeting', i.meetingType.name],
  ['When', fmt(i.start, i.inviteeTimezone)],
  ['Duration', `${i.meetingType.durationMin} minutes`],
  ['Timezone', i.inviteeTimezone.replace(/_/g, ' ')],
])}
${i.videoUrl ? joinButton(i.videoUrl) : ''}
<p style="margin:18px 0 0;color:${MUTED};font-size:13px;border-top:1px solid #e2e8f0;padding-top:16px;">Need to cancel or reschedule? <a href="${cancelUrl}" style="color:${ACCENT};">Manage your booking</a>.</p>`;
  return shell(`Your ${i.meetingType.name} is confirmed`, body);
}

function inviteeConfirmationText(i: ConfirmInput): string {
  const cancelUrl = `${siteConfig.url}/book/cancel?token=${i.cancelToken}`;
  return [
    `You're booked: ${i.meetingType.name} with ${siteConfig.author}.`,
    ``,
    `${fmt(i.start, i.inviteeTimezone)} (${i.inviteeTimezone})`,
    `${i.meetingType.durationMin} minutes`,
    i.videoUrl ? `\nJoin: ${i.videoUrl}` : ``,
    ``,
    `Cancel or reschedule: ${cancelUrl}`,
  ].join('\n');
}

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
    description: i.videoUrl ? `Join: ${i.videoUrl}` : (i.notes ?? ''),
    organizerEmail: owner,
    attendeeEmail: i.inviteeEmail,
    location: i.videoUrl,
  });
  const attachments = [{ filename: 'invite.ics', content: Buffer.from(ics).toString('base64') }];
  const ownerTz = process.env.OWNER_TIMEZONE ?? 'America/New_York';

  await resend.emails.send({
    from: FROM,
    to: i.inviteeEmail,
    subject: `Confirmed: ${i.meetingType.name} with ${siteConfig.author}`,
    html: renderInviteeConfirmation(i),
    text: inviteeConfirmationText(i),
    attachments,
  });

  // ---- Owner notification ----
  const ownerBody = `
<p style="margin:0 0 6px;color:${ACCENT};font-size:13px;font-weight:600;letter-spacing:0.06em;">NEW BOOKING</p>
<h1 style="margin:0 0 16px;color:${INK};font-size:22px;">${i.inviteeName} booked a ${i.meetingType.name.toLowerCase()}.</h1>
${detailsTable([
  ['Guest', `${i.inviteeName} (${i.inviteeEmail})`],
  ['When', fmt(i.start, ownerTz)],
  ['Duration', `${i.meetingType.durationMin} minutes`],
  ['Notes', i.notes ? i.notes.replace(/</g, '&lt;') : '—'],
])}
${i.videoUrl ? joinButton(i.videoUrl) : ''}`;

  await resend.emails.send({
    from: FROM,
    to: owner,
    subject: `New booking: ${i.meetingType.name} — ${i.inviteeName}`,
    html: shell(`${i.inviteeName} booked a ${i.meetingType.name}`, ownerBody),
    text: `${i.inviteeName} (${i.inviteeEmail}) booked a ${i.meetingType.name}.\n${fmt(i.start, ownerTz)}\nNotes: ${i.notes ?? '—'}${i.videoUrl ? `\nJoin: ${i.videoUrl}` : ''}`,
    attachments,
  });
}

interface CancelInput {
  meetingTypeName: string;
  start: Date;
  inviteeName: string;
  inviteeEmail: string;
  inviteeTimezone: string;
}

export async function sendCancellationEmails(i: CancelInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const owner = process.env.OWNER_EMAIL;
  if (!apiKey || !owner) throw new Error('RESEND_API_KEY or OWNER_EMAIL not set');
  const resend = new Resend(apiKey);
  const ownerTz = process.env.OWNER_TIMEZONE ?? 'America/New_York';

  const body = (whenLabel: string, lead: string) => `
<p style="margin:0 0 6px;color:#e11d48;font-size:13px;font-weight:600;letter-spacing:0.06em;">CANCELLED</p>
<h1 style="margin:0 0 12px;color:${INK};font-size:22px;">${lead}</h1>
${detailsTable([
  ['Meeting', i.meetingTypeName],
  ['Was', whenLabel],
])}
<p style="margin:18px 0 0;color:${MUTED};font-size:13px;">Want to find another time? <a href="${siteConfig.url}/book" style="color:${ACCENT};">Book again</a>.</p>`;

  await resend.emails.send({
    from: FROM,
    to: i.inviteeEmail,
    subject: `Cancelled: ${i.meetingTypeName} with ${siteConfig.author}`,
    html: shell(
      'Your booking was cancelled',
      body(
        `${fmt(i.start, i.inviteeTimezone)} (${i.inviteeTimezone})`,
        'Your booking is cancelled.',
      ),
    ),
    text: `Your ${i.meetingTypeName} on ${fmt(i.start, i.inviteeTimezone)} is cancelled.\nBook again: ${siteConfig.url}/book`,
  });

  await resend.emails.send({
    from: FROM,
    to: owner,
    subject: `Cancelled: ${i.meetingTypeName} — ${i.inviteeName}`,
    html: shell(
      'A booking was cancelled',
      body(fmt(i.start, ownerTz), `${i.inviteeName} cancelled their booking.`),
    ),
    text: `${i.inviteeName} (${i.inviteeEmail}) cancelled their ${i.meetingTypeName} on ${fmt(i.start, ownerTz)}.`,
  });
}
