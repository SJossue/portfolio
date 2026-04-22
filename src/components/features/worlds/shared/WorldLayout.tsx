'use client';

import { useEffect } from 'react';
import WorldTheme from '@/components/features/worlds/shared/WorldTheme';
import WorldNav from '@/components/features/worlds/shared/WorldNav';
import SmoothScroll from '@/components/features/worlds/shared/SmoothScroll';
import { useWorldLoader } from '@/lib/world-loader-store';

interface WorldLayoutProps {
  worldId: string;
  children: React.ReactNode;
}

export default function WorldLayout({ worldId, children }: WorldLayoutProps) {
  const markReady = useWorldLoader((s) => s.markReady);
  const dismiss = useWorldLoader((s) => s.dismiss);

  // Signal "world chrome mounted" after the next paint.
  // The loader enforces a min display window, so brief gaps don't flash.
  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      if (cancelled) return;
      // One extra rAF to let dynamic-imported 3D heroes attach their Canvases.
      requestAnimationFrame(() => {
        if (!cancelled) markReady();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [markReady, worldId]);

  // Safety net: if the loader is still up after 6s (slow network / GLB), force-dismiss.
  useEffect(() => {
    const t = window.setTimeout(() => dismiss(), 6000);
    return () => window.clearTimeout(t);
  }, [dismiss]);

  return (
    <WorldTheme worldId={worldId}>
      <SmoothScroll>
        <div className="relative min-h-dvh bg-[#030318]">
          <WorldNav worldId={worldId} />
          <main id="main-content">{children}</main>
        </div>
      </SmoothScroll>
    </WorldTheme>
  );
}
