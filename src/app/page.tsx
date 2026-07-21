'use client';

import dynamic from 'next/dynamic';

// Dynamically imported to keep the heavy client tree (IslandChat, motion) in its
// own chunk. SSR stays on: the hub no longer mounts WebGL, and its browser-only
// APIs run inside effects/callbacks, so the homepage HTML still renders
// server-side (better LCP than an empty shell).
const TrifoldHub = dynamic(() => import('@/components/features/hub/trifold/TrifoldHub'));

export default function Home() {
  return (
    <main id="main-content">
      <TrifoldHub />
    </main>
  );
}
