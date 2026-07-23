'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';

import IslandChat from '@/components/features/hub/LazyIslandChat';
import TrifoldLayout from '@/components/features/hub/trifold/TrifoldLayout';
import type { ResourceStage, ResourceStageId } from '@/content/resources';
import { useIsMobile } from '@/hooks/useIsMobile';

import {
  ACCENT,
  ExternalLinkButton,
  ItemCardBody,
  ResourceTypeBadge,
  Socials,
  StageCardBody,
  TagChips,
  WORLD_COLOR,
  WORLD_NAME,
  eyebrow,
} from './ResourcesStatic';

interface ResourcesShellProps {
  stages: ResourceStage[];
}

const PAGE_INTRO =
  'Career advice, programs, and opportunities worth knowing about — organized by where you are right now.';

const CARD_CLASS =
  'group block w-full overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] text-left transition-colors hover:border-[color:var(--world-color)]';
const CARD_STYLE = { ['--world-color' as string]: `rgba(${ACCENT}, 0.5)` };

/**
 * Resources — a self-contained trifold, entered from the left nav rather than
 * the homepage island carousel, that swaps its three panels across three
 * client-only views: the stage hub, a single stage, and a single resource
 * item. All content is plain data (no MDX), so unlike Garage/Student this
 * shell owns view-selection state directly instead of reading a precomputed
 * server-rendered node map — there's no server/client boundary to bridge.
 */
export default function ResourcesShell({ stages }: ResourcesShellProps) {
  const isMobile = useIsMobile();
  const [selectedStageId, setSelectedStageId] = useState<ResourceStageId | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stage = stages.find((s) => s.id === selectedStageId) ?? null;
  const item = stage?.items.find((i) => i.id === selectedItemId) ?? null;

  // Reset scroll position and move focus to the panel on every view change,
  // so keyboard/screen-reader users aren't left on an unmounted button.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
    scrollRef.current?.focus({ preventScroll: true });
  }, [selectedStageId, selectedItemId]);

  const enterStage = (id: ResourceStageId) => {
    setSelectedStageId(id);
    setSelectedItemId(null);
  };
  const exitToHub = () => {
    setSelectedStageId(null);
    setSelectedItemId(null);
  };
  const enterItem = (id: string) => setSelectedItemId(id);
  const exitToStage = () => setSelectedItemId(null);

  // ── Left panel ────────────────────────────────────────────────────────────
  let left: ReactNode;
  if (item && stage) {
    left = (
      <div className="flex h-full flex-col gap-5 p-6">
        <button
          type="button"
          onClick={exitToStage}
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
        >
          <span aria-hidden>&larr;</span> {stage.name}
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: WORLD_COLOR }}>
            {item.title}
          </h1>
          <div className="mt-2">
            <ResourceTypeBadge type={item.type} />
          </div>
        </div>
      </div>
    );
  } else if (stage) {
    left = (
      <div className="flex h-full flex-col gap-5 p-6">
        <button
          type="button"
          onClick={exitToHub}
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
        >
          <span aria-hidden>&larr;</span> {WORLD_NAME}
        </button>
        <div>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: WORLD_COLOR }}>
            {stage.name}
          </h1>
          <p className="mt-1 text-sm text-white/60">{stage.subtitle}</p>
        </div>
        <div className="mt-auto pt-2">
          <IslandChat
            accentColor={WORLD_COLOR}
            accentRgb={ACCENT}
            isMobile={isMobile}
            defaultMinimized={isMobile}
          />
        </div>
      </div>
    );
  } else {
    left = (
      <div className="flex h-full flex-col gap-5 p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
        >
          <span aria-hidden>&larr;</span> Hub
        </Link>
        <div>
          <h1 className="text-lg font-bold tracking-tight" style={{ color: WORLD_COLOR }}>
            {WORLD_NAME}
          </h1>
        </div>
        <p className="text-sm leading-relaxed text-white/60">{PAGE_INTRO}</p>
        <div className="mt-auto pt-2">
          <IslandChat
            accentColor={WORLD_COLOR}
            accentRgb={ACCENT}
            isMobile={isMobile}
            defaultMinimized={isMobile}
          />
        </div>
      </div>
    );
  }

  // ── Center panel ──────────────────────────────────────────────────────────
  let centerContent: ReactNode;
  if (item) {
    centerContent = (
      <div className="px-6 py-12 text-white sm:px-8">
        <p className={eyebrow}>{stage?.name}</p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{item.title}</h2>
        <div className="mt-3">
          <ResourceTypeBadge type={item.type} />
        </div>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70">{item.note}</p>
        {item.tags?.length ? (
          <div className="mt-6">
            <TagChips tags={item.tags} />
          </div>
        ) : null}
        {item.url ? (
          <div className="mt-8">
            <ExternalLinkButton url={item.url} />
          </div>
        ) : null}
      </div>
    );
  } else if (stage) {
    centerContent = (
      <div className="px-6 py-12 text-white sm:px-8">
        <p className={eyebrow}>{stage.subtitle}</p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{stage.name}</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">{stage.intro}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {stage.items.map((i) => (
            <button
              key={i.id}
              type="button"
              onClick={() => enterItem(i.id)}
              className={CARD_CLASS}
              style={CARD_STYLE}
            >
              <ItemCardBody item={i} />
            </button>
          ))}
        </div>
      </div>
    );
  } else {
    centerContent = (
      <div className="px-6 py-12 text-white sm:px-8">
        <p className={eyebrow}>Explore</p>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Pick a stage</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {stages.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => enterStage(s.id)}
              className={CARD_CLASS}
              style={CARD_STYLE}
            >
              <StageCardBody stage={s} />
            </button>
          ))}
        </div>
      </div>
    );
  }
  const center = (
    <div ref={scrollRef} tabIndex={-1} className="lg:h-full lg:overflow-y-auto">
      {centerContent}
    </div>
  );

  // ── Right panel ───────────────────────────────────────────────────────────
  let right: ReactNode;
  if (item) {
    right = (
      <div className="flex h-full flex-col gap-8 p-6 text-white">
        {item.tags?.length ? (
          <section>
            <p className={eyebrow}>Tags</p>
            <TagChips tags={item.tags} />
          </section>
        ) : null}
        {item.url ? (
          <section>
            <p className={eyebrow}>Link</p>
            <ExternalLinkButton url={item.url} />
          </section>
        ) : null}
        <Socials />
      </div>
    );
  } else if (stage) {
    const stageTags = Array.from(new Set(stage.items.flatMap((i) => i.tags ?? [])));
    right = (
      <div className="flex h-full flex-col gap-8 p-6 text-white">
        <section>
          <p className={eyebrow}>In this stage</p>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3">
            <p className="text-2xl font-black text-white">{stage.items.length}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
              {stage.items.length === 1 ? 'resource' : 'resources'}
            </p>
          </div>
        </section>
        {stageTags.length > 0 ? (
          <section>
            <p className={eyebrow}>Tags</p>
            <TagChips tags={stageTags} />
          </section>
        ) : null}
        <Socials />
      </div>
    );
  } else {
    const totalItems = stages.reduce((sum, s) => sum + s.items.length, 0);
    right = (
      <div className="flex h-full flex-col gap-8 p-6 text-white">
        <section>
          <p className={eyebrow}>By the numbers</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3">
              <p className="text-2xl font-black text-white">{stages.length}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
                Stages
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3">
              <p className="text-2xl font-black text-white">{totalItems}</p>
              <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-white/60">
                Resources
              </p>
            </div>
          </div>
        </section>
        <Socials />
      </div>
    );
  }

  return (
    <TrifoldLayout
      colorRgb={ACCENT}
      lead={
        <a
          href="#resources-main"
          className="sr-only fixed left-4 top-4 z-[100] rounded bg-amber-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
        >
          Skip to content
        </a>
      }
      left={{ as: 'aside', panelProps: { 'aria-label': 'Resources navigation' }, children: left }}
      center={{
        as: 'main',
        panelProps: { id: 'resources-main', tabIndex: -1, 'aria-label': WORLD_NAME },
        children: center,
      }}
      right={{ as: 'aside', panelProps: { 'aria-label': 'Resource details' }, children: right }}
    />
  );
}
