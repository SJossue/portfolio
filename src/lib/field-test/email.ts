import { Resend } from 'resend';

import type { SubmissionInput } from './submissions';

const FROM = 'IVP Committee Screening <field-test@jossue.dev>';
const ACCENT = '#22d3ee';
const INK = '#0f172a';
const MUTED = '#64748b';

/** Escape candidate-supplied text before interpolating into email HTML — a
 *  submitted name/story value is untrusted and would otherwise inject markup. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:12px 16px;border-top:1px solid #f1f5f9;color:${MUTED};font-size:13px;width:110px;vertical-align:top;">${label}</td>
<td style="padding:12px 16px;border-top:1px solid #f1f5f9;color:${INK};font-size:14px;font-weight:500;white-space:pre-wrap;">${value}</td></tr>`;
}

/** Pure: the owner notification email HTML. Exported for previews/tests. */
export function renderSubmissionNotification(i: SubmissionInput): string {
  const rows = [
    row('Candidate', esc(i.candidateName)),
    row('Department move', esc(i.deptChoiceLabel)),
    ...(i.deptWhy ? [row('Why', esc(i.deptWhy))] : []),
    row('Finishes early', esc(i.earlyChoiceLabel)),
    row('Kept pushing story', esc(i.story)),
    row(
      'Pattern recall',
      i.patternMatched
        ? 'Matched exactly'
        : `Did not match (shown ${i.patternShown.join(',')} / repeated ${i.patternRecalled.join(',')})`,
    ),
  ].join('');

  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f1f5f9;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:16px;overflow:hidden;font-family:'Segoe UI',Helvetica,Arial,sans-serif;box-shadow:0 8px 30px rgba(2,6,23,0.08);">
<tr><td style="background:#0d0d14;padding:20px 28px;">
<span style="color:${ACCENT};font-weight:700;font-size:14px;letter-spacing:0.04em;">SHPE NJIT &middot; IVP Committee Screening</span>
</td></tr>
<tr><td style="padding:28px 28px 8px;">
<p style="margin:0 0 4px;color:${ACCENT};font-size:13px;font-weight:600;letter-spacing:0.06em;">NEW SUBMISSION</p>
<h1 style="margin:0 0 16px;color:${INK};font-size:22px;">${esc(i.candidateName)} completed the IVP Committee Screening.</h1>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e2e8f0;border-radius:12px;">${rows}</table>
</td></tr>
<tr><td style="padding:18px 28px 28px;color:${MUTED};font-size:12px;">Reference ${i.code} &middot; saved to the field_test_submissions table.</td></tr>
</table>
</td></tr></table></body></html>`;
}

function renderSubmissionNotificationText(i: SubmissionInput): string {
  return [
    `New IVP Committee Screening submission — ${i.code}`,
    ``,
    `Candidate: ${i.candidateName}`,
    `Department move: ${i.deptChoiceLabel}`,
    i.deptWhy ? `Why: ${i.deptWhy}` : null,
    `Finishes early: ${i.earlyChoiceLabel}`,
    ``,
    `Kept pushing story:`,
    i.story,
    ``,
    `Pattern recall: ${i.patternMatched ? 'matched exactly' : 'did not match'}`,
    `  Shown:    ${i.patternShown.join(',')}`,
    `  Repeated: ${i.patternRecalled.join(',')}`,
  ]
    .filter((line): line is string => line !== null)
    .join('\n');
}

/** Best-effort notification — the database row is the source of truth, so a
 *  failure here should never block or roll back the submission itself. */
export async function sendSubmissionNotification(input: SubmissionInput): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const owner = process.env.OWNER_EMAIL;
  if (!apiKey || !owner) throw new Error('RESEND_API_KEY or OWNER_EMAIL not set');
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: FROM,
    to: owner,
    subject: `IVP Committee Screening: ${input.candidateName} — ${input.code}`,
    html: renderSubmissionNotification(input),
    text: renderSubmissionNotificationText(input),
  });
}
