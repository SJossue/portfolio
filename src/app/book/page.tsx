import type { Metadata } from 'next';
import Link from 'next/link';
import { BookingWidget } from '@/components/features/schedule/BookingWidget';

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
  return (
    <main id="main-content" className="relative min-h-screen bg-[#08080d] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1000px 600px at 50% -5%, rgba(34,211,238,0.08), transparent 70%)',
        }}
      />
      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-12">
        <BookingWidget />
        <Link
          href="/"
          className="mt-6 text-sm text-slate-500 transition-colors hover:text-slate-300"
        >
          ← Back to jossue.dev
        </Link>
      </div>
    </main>
  );
}
