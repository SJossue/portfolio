'use client';

import dynamic from 'next/dynamic';

const HubCarousel = dynamic(() => import('@/components/features/hub/HubCarousel'), { ssr: false });

export default function Home() {
  return (
    <main id="main-content">
      <HubCarousel />
    </main>
  );
}
