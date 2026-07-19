import type { Metadata } from 'next';

import BookingTrifold from '@/components/features/schedule/BookingTrifold';

export const metadata: Metadata = {
  title: 'Book a call',
  description:
    'Schedule a call with Jossue Sarango — intro chats, project deep-dives, or mentoring. Pick a time that works for you and get an instant calendar invite.',
  alternates: { canonical: '/book' },
  openGraph: {
    title: 'Book a call — Jossue Sarango',
    description: 'Pick a time to talk. Instant confirmation, no back-and-forth.',
    url: '/book',
  },
};

export default function BookPage() {
  return <BookingTrifold />;
}
