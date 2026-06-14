import type { Metadata } from 'next';
import { CancelPanel } from '@/components/features/schedule/CancelPanel';

export const metadata: Metadata = {
  title: 'Cancel booking',
  description: 'Cancel or manage your booking with Jossue Sarango.',
  robots: { index: false, follow: false },
};

export default async function CancelBookingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <main
      id="main-content"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050510] px-5 py-16 text-white"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(800px 500px at 50% 0%, rgba(34,211,238,0.08), transparent 70%)',
        }}
      />
      <div className="relative w-full">
        <CancelPanel token={token ?? ''} />
      </div>
    </main>
  );
}
