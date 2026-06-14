export interface Interval {
  start: Date; // UTC instant
  end: Date; // UTC instant
}

export interface MeetingType {
  id: string;
  name: string;
  slug: string;
  durationMin: number;
  description: string;
  /** accent hex, matches site palette */
  accent: string;
}

/** A daily window expressed in the OWNER's timezone, 24h "HH:mm". */
export interface DailyWindow {
  weekday: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  start: string; // "09:00"
  end: string; // "17:00"
}

export interface AvailabilityRules {
  ownerTimezone: string; // IANA, e.g. "America/New_York"
  windows: DailyWindow[];
  slotGranularityMin: number; // e.g. 30
  minNoticeMin: number; // earliest a slot may be booked from "now"
  horizonDays: number; // furthest day out that may be booked
  bufferBeforeMin: number;
  bufferAfterMin: number;
}

export interface Slot {
  startUtc: string; // ISO
  endUtc: string; // ISO
}

export interface BookingInput {
  meetingTypeId: string;
  startUtc: string; // ISO
  name: string;
  email: string;
  timezone: string;
  notes?: string;
}
