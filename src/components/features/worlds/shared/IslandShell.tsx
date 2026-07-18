'use client';

import { useEffect, useRef } from 'react';

import TrifoldLayout from '@/components/features/hub/trifold/TrifoldLayout';
import { worlds } from '@/content/worlds';
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

  return (
    <TrifoldLayout
      colorRgb={world.colorRgb}
      lead={
        <a
          href="#island-main"
          className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
        >
          Skip to content
        </a>
      }
      left={{
        as: 'nav',
        panelProps: { 'aria-label': `${world.name} sections` },
        children: <IslandTOC worldId={world.id} sections={sections} scrollRef={scrollRef} />,
      }}
      center={{
        as: 'section',
        panelProps: { id: 'island-main', tabIndex: -1, 'aria-label': world.name },
        children: (
          <div ref={scrollRef} className="lg:h-full lg:overflow-y-auto">
            {children}
          </div>
        ),
      }}
      right={{
        as: 'aside',
        panelProps: { 'aria-label': `${world.name} highlights` },
        children: aside,
      }}
    />
  );
}
