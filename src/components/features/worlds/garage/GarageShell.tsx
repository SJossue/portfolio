'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';

import IslandChat from '@/components/features/hub/LazyIslandChat';
import TrifoldLayout from '@/components/features/hub/trifold/TrifoldLayout';
import { useGarageSelection } from '@/lib/garage-selection-store';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useWorldLoader } from '@/lib/world-loader-store';

import { GarageSelectTrigger } from './GarageSelectTrigger';

interface DetailContent {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

interface GarageShellProps {
  worldName: string;
  worldColor: string;
  worldColorRgb: string;
  overviewLeftBody: ReactNode;
  overviewCenter: ReactNode;
  overviewRight: ReactNode;
  /** Project id → title, just enough to label the project-scoped chat. */
  projectTitles: Record<string, string>;
  details: Record<string, DetailContent>;
}

/**
 * My Garage — a self-contained trifold that swaps its three panels between an
 * overview (project directory · featured cards · toolbox) and a per-project
 * detail view, all via client state (no route change). All the actual content
 * (case studies, galleries, tool lists, cards) is precomputed server-side in
 * `garage/page.tsx` and handed down as ready-made ReactNode props; this shell
 * only holds the selection state, the loader lifecycle, and the bits that
 * genuinely need the browser (mobile detection, the project-scoped chat).
 */
export default function GarageShell({
  worldName,
  worldColor,
  worldColorRgb,
  overviewLeftBody,
  overviewCenter,
  overviewRight,
  projectTitles,
  details,
}: GarageShellProps) {
  const markReady = useWorldLoader((s) => s.markReady);
  const dismiss = useWorldLoader((s) => s.dismiss);
  const isMobile = useIsMobile();
  const selectedId = useGarageSelection((s) => s.selectedId);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Signal the world loader to dismiss once the island chrome has painted.
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
  }, [markReady]);

  // Safety net: force-dismiss the loader if it's somehow still up after 6s.
  useEffect(() => {
    const t = window.setTimeout(() => dismiss(), 6000);
    return () => window.clearTimeout(t);
  }, [dismiss]);

  // Reset scroll position whenever the selection changes (the center panel is
  // also re-keyed below, which already resets scroll on remount — this covers
  // the case where it doesn't).
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selectedId]);

  const detail = selectedId ? details[selectedId] : null;
  const projectTitle = selectedId ? projectTitles[selectedId] : null;

  // ── Left panel ────────────────────────────────────────────────────────────
  const left = detail ? (
    <div className="flex h-full flex-col gap-5 p-6">
      <GarageSelectTrigger
        projectId={null}
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Projects
      </GarageSelectTrigger>

      {detail.left}

      {/* Project-scoped assistant — ask questions about this specific build. */}
      <div className="mt-auto pt-2">
        <IslandChat
          key={selectedId}
          projectId={selectedId ?? undefined}
          projectLabel={projectTitle?.split(':')[0]}
          accentColor={worldColor}
          accentRgb={worldColorRgb}
          isMobile={isMobile}
          defaultMinimized={isMobile}
        />
      </div>
    </div>
  ) : (
    <div className="flex h-full flex-col gap-5 p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Hub
      </Link>
      <div>
        <h1 className="text-lg font-bold tracking-tight" style={{ color: worldColor }}>
          {worldName}
        </h1>
      </div>
      {overviewLeftBody}
    </div>
  );

  // ── Center panel ──────────────────────────────────────────────────────────
  const center = (
    <div key={selectedId ?? 'overview'} ref={scrollRef} className="lg:h-full lg:overflow-y-auto">
      {detail ? detail.center : overviewCenter}
    </div>
  );

  // ── Right panel ───────────────────────────────────────────────────────────
  const right = detail ? detail.right : overviewRight;

  return (
    <TrifoldLayout
      colorRgb={worldColorRgb}
      lead={
        <a
          href="#garage-main"
          className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
        >
          Skip to content
        </a>
      }
      left={{ as: 'aside', panelProps: { 'aria-label': 'Project navigation' }, children: left }}
      center={{
        as: 'main',
        panelProps: { id: 'garage-main', tabIndex: -1, 'aria-label': worldName },
        children: center,
      }}
      right={{ as: 'aside', panelProps: { 'aria-label': 'Project details' }, children: right }}
    />
  );
}
