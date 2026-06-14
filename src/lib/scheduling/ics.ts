export interface IcsInput {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
  description: string;
  organizerEmail: string;
  attendeeEmail: string;
  location?: string;
}

function stamp(d: Date): string {
  return d
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

function esc(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildIcs(i: IcsInput): string {
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//jossue.dev//scheduling//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${i.uid}`,
    `DTSTAMP:${stamp(i.start)}`,
    `DTSTART:${stamp(i.start)}`,
    `DTEND:${stamp(i.end)}`,
    `SUMMARY:${esc(i.summary)}`,
    `DESCRIPTION:${esc(i.description)}`,
    i.location ? `LOCATION:${esc(i.location)}` : '',
    `ORGANIZER:mailto:${i.organizerEmail}`,
    `ATTENDEE;RSVP=TRUE:mailto:${i.attendeeEmail}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');
}
