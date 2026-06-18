import type { Metadata } from 'next';
import { ReschedulePanel } from '@/components/features/schedule/ReschedulePanel';

export const metadata: Metadata = {
  title: 'Reschedule booking',
  description: 'Move your booking with Jossue Sarango to a new time.',
  robots: { index: false, follow: false },
};

export default async function ReschedulePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main
      id="main-content"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080d] px-4 py-12 text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(1000px 600px at 50% -5%, rgba(34,211,238,0.08), transparent 70%)',
        }}
      />
      <div className="relative w-full">
        <ReschedulePanel token={token ?? ''} />
      </div>
    </main>
  );
}
