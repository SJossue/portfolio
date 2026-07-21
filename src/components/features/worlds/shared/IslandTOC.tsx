'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import IslandChat from '@/components/features/hub/IslandChat';
import { worlds } from '@/content/worlds';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';

import type { IslandSectionRef } from './IslandShell';

interface IslandTOCProps {
  worldId: string;
  sections: IslandSectionRef[];
  /** Optional short blurb shown above the section nav. */
  intro?: React.ReactNode;
  /** When true, pins the AI assistant to the bottom of the rail. */
  chat?: boolean;
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Left-rail table of contents for an island. Highlights the section currently in
 * view (scroll-spy) and scrolls the middle panel to a section on click. Vertical
 * on desktop, a horizontal chip strip on mobile.
 */
export default function IslandTOC({ worldId, sections, intro, chat, scrollRef }: IslandTOCProps) {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const world = worlds.find((w) => w.id === worldId) ?? worlds[0];
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const root = isMobile ? null : scrollRef.current;
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { root, rootMargin: '-15% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections, scrollRef, isMobile]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    setActive(id);
  };

  return (
    <div className="flex h-full flex-col gap-5 p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Hub
      </Link>

      <div>
        <h1 className="text-lg font-bold tracking-tight" style={{ color: world.color }}>
          {world.name}
        </h1>
      </div>

      {intro ? <p className="text-sm leading-relaxed text-white/60">{intro}</p> : null}

      <nav
        aria-label="On this page"
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {sections.map((s) => {
          const on = s.id === active;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => go(s.id)}
              aria-current={on ? 'true' : undefined}
              className="flex-shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors lg:border-l-2"
              style={{
                color: on ? '#fff' : 'rgba(255,255,255,0.55)',
                background: on && isMobile ? `rgba(${world.colorRgb}, 0.16)` : 'transparent',
                borderColor: on && !isMobile ? world.color : 'transparent',
              }}
            >
              {s.label}
            </button>
          );
        })}
      </nav>

      {chat ? (
        <div className="mt-auto pt-2">
          <IslandChat
            accentColor={world.color}
            accentRgb={world.colorRgb}
            isMobile={isMobile}
            defaultMinimized={isMobile}
          />
        </div>
      ) : null}
    </div>
  );
}
