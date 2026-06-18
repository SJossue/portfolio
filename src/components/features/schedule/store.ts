import { create } from 'zustand';

export type BookingStep = 'type' | 'schedule' | 'details' | 'done';

interface BookingState {
  step: BookingStep;
  meetingTypeId: string | null;
  /** Selected calendar day as a YYYY-MM-DD key in the visitor's timezone. */
  dayKey: string | null;
  /** Selected slot start, ISO UTC. */
  slotUtc: string | null;
  timezone: string;

  setTimezone: (tz: string) => void;
  selectType: (id: string) => void;
  selectDay: (dayKey: string) => void;
  selectSlot: (slotUtc: string) => void;
  goTo: (step: BookingStep) => void;
  complete: () => void;
  reset: () => void;
}

export const useBooking = create<BookingState>((set) => ({
  step: 'type',
  meetingTypeId: null,
  dayKey: null,
  slotUtc: null,
  timezone: 'UTC',

  setTimezone: (timezone) => set({ timezone }),
  selectType: (id) => set({ meetingTypeId: id, step: 'schedule', dayKey: null, slotUtc: null }),
  selectDay: (dayKey) => set({ dayKey, slotUtc: null }),
  selectSlot: (slotUtc) => set({ slotUtc, step: 'details' }),
  goTo: (step) => set({ step }),
  complete: () => set({ step: 'done' }),
  reset: () => set({ step: 'type', meetingTypeId: null, dayKey: null, slotUtc: null }),
}));
