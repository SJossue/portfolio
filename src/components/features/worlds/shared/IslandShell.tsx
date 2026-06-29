'use client';

import { useEffect, useRef } from 'react';

import HubBackground from '@/components/features/hub/trifold/HubBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { worlds } from '@/content/worlds';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useWorldLoader } from '@/lib/world-loader-store';

import IslandTOC from './IslandTOC';

export interface IslandSectionRef {
  /** Matches the `id` of the corresponding IslandSection in the middle panel. */
  id: string;
  /** Label shown in the left-rail table of contents. */
  label: string;
}

interface IslandShellProps {
  worldId: string;
  /** Section anchors for the left-rail nav / scroll-spy. */
  sections: IslandSectionRef[];
  /** Right-panel content (highlights / links / contact). */
  aside: React.ReactNode;
  /** The primary, scrollable middle-panel content. */
  children: React.ReactNode;
}

/**
 * Trifold scaffold for an island page — mirrors the homepage hub. Left = section
 * nav (scroll-spy), center = the primary scrollable content, right = the island's
 * complementary aside. Sets the per-world accent, paints the themed background,
 * and signals the WorldLoader to dismiss once mounted.
 */
export default function IslandShell({ worldId, sections, aside, children }: IslandShellProps) {
  const isMobile = useIsMobile();
  const markReady = useWorldLoader((s) => s.markReady);
  const dismiss = useWorldLoader((s) => s.dismiss);
  const scrollRef = useRef<HTMLDivElement>(null);
  const world = worlds.find((w) => w.id === worldId) ?? worlds[0];

  // Signal "island chrome mounted" after the next paint so the loader dismisses.
  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) markReady();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [markReady, worldId]);

  // Safety net: force-dismiss the loader if it's somehow still up after 6s.
  useEffect(() => {
    const t = window.setTimeout(() => dismiss(), 6000);
    return () => window.clearTimeout(t);
  }, [dismiss]);

  const angle = (deg: number, origin: string) =>
    isMobile
      ? undefined
      : { transform: `perspective(1600px) rotateY(${deg}deg)`, transformOrigin: origin };

  return (
    <div
      className="relative min-h-dvh bg-[#07070b]"
      style={{ '--world-color-rgb': world.colorRgb } as React.CSSProperties}
    >
      <a
        href="#island-main"
        className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
      >
        Skip to content
      </a>

      <HubBackground colorRgb={world.colorRgb} worldId={world.id} />

      <div className="relative z-10 flex flex-col gap-4 p-4 lg:grid lg:h-dvh lg:grid-cols-[minmax(0,18rem)_1.5fr_minmax(0,22rem)] lg:gap-5 lg:p-6">
        {/* LEFT — section navigation. */}
        <GlassPanel
          as="nav"
          aria-label={`${world.name} sections`}
          accent
          className="overflow-visible lg:h-full lg:overflow-y-auto"
          style={angle(13, 'right center')}
        >
          <IslandTOC worldId={world.id} sections={sections} scrollRef={scrollRef} />
        </GlassPanel>

        {/* CENTER — primary scrollable content. */}
        <GlassPanel
          as="section"
          id="island-main"
          tabIndex={-1}
          aria-label={world.name}
          accent
          className="focus-visible:outline-none lg:h-full lg:overflow-hidden"
        >
          <div ref={scrollRef} className="lg:h-full lg:overflow-y-auto">
            {children}
          </div>
        </GlassPanel>

        {/* RIGHT — island complement. */}
        <GlassPanel
          as="aside"
          aria-label={`${world.name} highlights`}
          accent
          className="overflow-visible lg:h-full lg:overflow-y-auto"
          style={angle(-13, 'left center')}
        >
          {aside}
        </GlassPanel>
      </div>
    </div>
  );
}
