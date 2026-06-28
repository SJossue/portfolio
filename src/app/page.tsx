'use client';

import dynamic from 'next/dynamic';

const TrifoldHub = dynamic(() => import('@/components/features/hub/trifold/TrifoldHub'), {
  ssr: false,
});

export default function Home() {
  return (
    <main id="main-content">
      <TrifoldHub />
    </main>
  );
}
