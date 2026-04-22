'use client';

import { useEffect, useState } from 'react';
import { worlds } from '@/content/worlds';
import WorldTheme from '@/components/features/worlds/shared/WorldTheme';
import WorldNav from '@/components/features/worlds/shared/WorldNav';
import SmoothScroll from '@/components/features/worlds/shared/SmoothScroll';

interface WorldLayoutProps {
  worldId: string;
  children: React.ReactNode;
}

export default function WorldLayout({ worldId, children }: WorldLayoutProps) {
  const [entered, setEntered] = useState(false);
  const world = worlds.find((w) => w.id === worldId);

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <WorldTheme worldId={worldId}>
      <SmoothScroll>
        <div className="relative min-h-dvh bg-[#030318]">
          <WorldNav worldId={worldId} />

          {/* Entry color-wash overlay */}
          <div
            className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-[800ms] ease-out"
            style={{
              backgroundColor: world?.color,
              opacity: entered ? 0 : 1,
            }}
          />

          <main id="main-content">{children}</main>
        </div>
      </SmoothScroll>
    </WorldTheme>
  );
}
