import type { AvailabilityRules, MeetingType } from '@/lib/scheduling/types';

export const meetingTypes: MeetingType[] = [
  {
    id: 'intro',
    name: 'Intro Call',
    slug: 'intro',
    durationMin: 30,
    description: 'A quick hello — opportunities, collaboration, or just to connect.',
    accent: '#22d3ee',
  },
  {
    id: 'project',
    name: 'Project Chat',
    slug: 'project',
    durationMin: 45,
    description: 'Deep-dive on a build, a hardware/software problem, or applied AI.',
    accent: '#a78bfa',
  },
  {
    id: 'mentoring',
    name: 'Mentoring',
    slug: 'mentoring',
    durationMin: 60,
    description: 'Career, engineering school, or breaking into hardware + software.',
    accent: '#f472b6',
  },
];

export const availabilityRules: AvailabilityRules = {
  ownerTimezone: process.env.OWNER_TIMEZONE ?? 'America/New_York',
  windows: [
    { weekday: 1, start: '10:00', end: '17:00' },
    { weekday: 2, start: '10:00', end: '17:00' },
    { weekday: 3, start: '10:00', end: '17:00' },
    { weekday: 4, start: '10:00', end: '17:00' },
    { weekday: 5, start: '10:00', end: '15:00' },
  ],
  slotGranularityMin: 30,
  minNoticeMin: 240,
  horizonDays: 30,
  bufferBeforeMin: 0,
  bufferAfterMin: 10,
};

export function meetingTypeById(id: string): MeetingType | undefined {
  return meetingTypes.find((m) => m.id === id);
}
