import { describe, expect, it } from 'vitest';

import { renderInviteeConfirmation } from './email';
import type { MeetingType } from './types';

const meetingType: MeetingType = {
  id: 'intro',
  name: 'Intro Call',
  slug: 'intro',
  durationMin: 30,
  description: 'A quick intro.',
  accent: '#0891b2',
};

const base = {
  meetingType,
  start: new Date('2026-08-01T15:00:00Z'),
  end: new Date('2026-08-01T15:30:00Z'),
  inviteeEmail: 'guest@example.com',
  inviteeTimezone: 'America/New_York',
  bookingId: 'b1',
  cancelToken: 'tok',
};

describe('renderInviteeConfirmation', () => {
  it('escapes HTML in the invitee name so a booked value cannot inject markup', () => {
    const html = renderInviteeConfirmation({
      ...base,
      inviteeName: '<script>alert(1)</script>',
    });
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('renders a normal name unescaped-looking (round-trips plain text)', () => {
    const html = renderInviteeConfirmation({ ...base, inviteeName: 'Ada Lovelace' });
    expect(html).toContain('See you soon, Ada.');
  });
});
