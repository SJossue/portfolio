'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';

import IslandChat from '@/components/features/hub/LazyIslandChat';
import TrifoldLayout from '@/components/features/hub/trifold/TrifoldLayout';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useStudentSelection } from '@/lib/student-selection-store';
import { useWorldLoader } from '@/lib/world-loader-store';

import { StudentSelectTrigger } from './StudentSelectTrigger';
import { SECTIONS } from './StudentStatic';

interface DetailContent {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

interface StudentShellProps {
  worldName: string;
  worldColor: string;
  worldColorRgb: string;
  introText: string;
  overviewCenter: ReactNode;
  overviewRight: ReactNode;
  /** Paper id → title, just enough to label the paper-scoped chat. */
  paperTitles: Record<string, string>;
  details: Record<string, DetailContent>;
}

/**
 * The Student — a self-contained trifold that swaps its three panels between an
 * overview (academic summary · paper cards · education) and a per-paper reading
 * view, all via client state (no route change). All the actual content
 * (education block, paper cards, rendered paper bodies) is precomputed
 * server-side in `student/page.tsx` and handed down as ready-made ReactNode
 * props; this shell only holds the selection state, the loader lifecycle, the
 * overview scroll-spy, and the bits that genuinely need the browser (mobile
 * detection, the paper-scoped chat). Mirrors GarageShell.
 */
export default function StudentShell({
  worldName,
  worldColor,
  worldColorRgb,
  introText,
  overviewCenter,
  overviewRight,
  paperTitles,
  details,
}: StudentShellProps) {
  const markReady = useWorldLoader((s) => s.markReady);
  const dismiss = useWorldLoader((s) => s.dismiss);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const selectedId = useStudentSelection((s) => s.selectedId);
  const [active, setActive] = useState(SECTIONS[0]?.id);
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

  // Reset scroll position whenever the selection changes.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selectedId]);

  // Scroll-spy for the overview TOC — only meaningful when no paper is selected.
  useEffect(() => {
    if (selectedId) return;
    const root = isMobile ? null : scrollRef.current;
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
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
  }, [selectedId, isMobile]);

  const go = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    setActive(id);
  };

  const detail = selectedId ? details[selectedId] : null;
  const paperTitle = selectedId ? paperTitles[selectedId] : null;

  // ── Left panel ────────────────────────────────────────────────────────────
  const left = detail ? (
    <div className="flex h-full flex-col gap-5 p-6">
      <StudentSelectTrigger
        paperId={null}
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Research
      </StudentSelectTrigger>

      {detail.left}

      {/* Paper-scoped assistant — ask questions about this specific paper. */}
      <div className="mt-auto pt-2">
        <IslandChat
          key={selectedId}
          projectId={selectedId ?? undefined}
          projectLabel={paperTitle ?? undefined}
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
      <p className="text-sm leading-relaxed text-white/60">{introText}</p>

      <nav
        aria-label="On this page"
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
      >
        {SECTIONS.map((s) => {
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
                background: on && isMobile ? `rgba(${worldColorRgb}, 0.16)` : 'transparent',
                borderColor: on && !isMobile ? worldColor : 'transparent',
              }}
            >
              {s.label}
            </button>
          );
        })}
      </nav>

      {/* General assistant — pinned to the bottom of the rail. */}
      <div className="mt-auto pt-2">
        <IslandChat
          accentColor={worldColor}
          accentRgb={worldColorRgb}
          isMobile={isMobile}
          defaultMinimized={isMobile}
        />
      </div>
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
          href="#student-main"
          className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
        >
          Skip to content
        </a>
      }
      left={{ as: 'aside', panelProps: { 'aria-label': 'Research navigation' }, children: left }}
      center={{
        as: 'main',
        panelProps: { id: 'student-main', tabIndex: -1, 'aria-label': worldName },
        children: center,
      }}
      right={{ as: 'aside', panelProps: { 'aria-label': 'Paper details' }, children: right }}
    />
  );
}
