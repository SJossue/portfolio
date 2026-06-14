import { expect, it } from 'vitest';
import { buildIcs } from './ics';

it('builds a valid single-event VCALENDAR', () => {
  const ics = buildIcs({
    uid: 'abc-123',
    start: new Date('2026-06-17T14:00:00Z'),
    end: new Date('2026-06-17T14:30:00Z'),
    summary: 'Intro Call with Jossue Sarango',
    description: 'Looking forward to it.',
    organizerEmail: 'hi@jossue.dev',
    attendeeEmail: 'guest@example.com',
  });
  expect(ics).toContain('BEGIN:VCALENDAR');
  expect(ics).toContain('BEGIN:VEVENT');
  expect(ics).toContain('UID:abc-123');
  expect(ics).toContain('DTSTART:20260617T140000Z');
  expect(ics).toContain('DTEND:20260617T143000Z');
  expect(ics).toContain('SUMMARY:Intro Call with Jossue Sarango');
  expect(ics).toContain('END:VCALENDAR');
});

it('escapes commas and newlines in text fields', () => {
  const ics = buildIcs({
    uid: 'x',
    start: new Date('2026-06-17T14:00:00Z'),
    end: new Date('2026-06-17T14:30:00Z'),
    summary: 'A, B',
    description: 'line1\nline2',
    organizerEmail: 'a@b.c',
    attendeeEmail: 'd@e.f',
  });
  expect(ics).toContain('SUMMARY:A\\, B');
  expect(ics).toContain('DESCRIPTION:line1\\nline2');
});
