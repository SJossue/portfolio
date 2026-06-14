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
    <main
      id="main-content"
      className="relative min-h-screen overflow-hidden bg-[#050510] text-white"
    >
      {/* Atmosphere — pure CSS, zero JS, no layout shift */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(900px 500px at 50% -10%, rgba(34,211,238,0.10), transparent 70%), radial-gradient(700px 500px at 100% 100%, rgba(167,139,250,0.06), transparent 70%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(circle at 50% 30%, black, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 30%, black, transparent 80%)',
          }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-5 py-14 sm:px-6 sm:py-20">
        <header className="mb-10 sm:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.28em] text-cyan-300/80">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            Scheduling console · availability online
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Book a call</h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-400">
            Grab a slot that suits you. Everything runs on my own scheduler — instant confirmation,
            a calendar invite in your inbox, no Calendly required.
          </p>
        </header>

        <BookingWidget />

        <footer className="mt-12 flex items-center justify-between border-t border-white/[0.06] pt-6">
          <Link
            href="/"
            className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-slate-500 transition-colors hover:text-slate-300"
          >
            ‹ Return to base
          </Link>
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-slate-700">
            jossue.dev
          </span>
        </footer>
      </div>
    </main>
  );
}
