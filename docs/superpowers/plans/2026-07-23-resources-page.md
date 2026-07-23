# Resources Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/resources` page — career advice, programs, and opportunities for students, organized into 4 stages (High School, College, Internships & Fellowships, Programs & Organizations), reached from a new "Resources" row in the left nav rail below "Blog."

**Architecture:** A bespoke `ResourcesShell` client component (modeled on `StudentShell`/`GarageShell`'s trifold-swap pattern) renders three nested client-only views — stage hub, single stage, single resource item — driven by plain `useState` (no Zustand store, no server/MDX precomputation needed, since all content is plain data). It reuses `TrifoldLayout`, `IslandChat`, and `HubSocials`, with its own amber accent, and is **not** added to `worlds.ts` / the homepage carousel — it's reached only via a plain nav link, like "Blog."

**Tech Stack:** Next.js App Router, React 19, TypeScript (strict), Tailwind CSS, Zustand (already a dependency, not newly introduced here), Vitest.

## Global Constraints

- Server Components by default; `"use client"` only where interactivity requires it (the spec's `ResourcesShell` needs it for view-selection state).
- `src/components/ui/**` stays presentation-only; this feature's components belong under `src/components/features/worlds/resources/**`.
- Route files (`src/app/**`) stay thin — delegate to `src/components/features/**`.
- Conventional Commits for every commit in this plan.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` before the work is considered done (per `CLAUDE.md`).
- Keep imports sorted; use the `@/` path alias (see `tsconfig.json`), matching every file read during planning.
- Accessibility: semantic HTML, keyboard support, visible focus, `prefers-reduced-motion` where animation is introduced (none is, in this plan — no scroll-spy or transition animation is needed for simple panel swaps).
- External resource links: `target="_blank" rel="noopener noreferrer"`.
- No new npm dependencies.

---

## Task 1: Resource content data model + tests

**Files:**

- Create: `src/content/resources.ts`
- Create: `src/content/resources.test.ts`
- Modify: `src/content/index.ts`

**Interfaces:**

- Produces: `resourceStages: ResourceStage[]`, and types `ResourceStage`, `ResourceItem`, `ResourceItemType`, `ResourceStageId`, all exported from `src/content/resources.ts` and re-exported from `src/content/index.ts`. Every later task imports `resourceStages` (data) and `ResourceStage`/`ResourceItem`/`ResourceItemType` (types) from `@/content/resources`.

- [ ] **Step 1: Write `src/content/resources.ts`**

```ts
export type ResourceStageId =
  | 'high-school'
  | 'college'
  | 'internships-fellowships'
  | 'programs-orgs';

export type ResourceItemType =
  | 'program'
  | 'scholarship'
  | 'fellowship'
  | 'organization'
  | 'tool'
  | 'article';

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceItemType;
  /** External link — omitted for placeholder entries pending a real one. */
  url?: string;
  tags?: string[];
  /** Your personal take — why it's here, your experience with it. */
  note: string;
}

export interface ResourceStage {
  id: ResourceStageId;
  name: string;
  subtitle: string;
  /** Personal blurb introducing the stage — shown in full in the stage view. */
  intro: string;
  items: ResourceItem[];
}

/**
 * Scaffold content — every item below is a clearly-marked placeholder. Replace
 * titles, tags, notes, and add real `url`s as a content pass; keep the shape.
 */
export const resourceStages: ResourceStage[] = [
  {
    id: 'high-school',
    name: 'High School',
    subtitle: 'Getting ready for what comes next',
    intro:
      "This is a starting scaffold — swap these in for the programs, deadlines, and advice you'd actually hand a high schooler asking where to begin.",
    items: [
      {
        id: 'hs-placeholder-1',
        title: 'Placeholder — a college-readiness program',
        type: 'program',
        tags: ['college prep'],
        note: 'Placeholder entry. Replace with a real program and your own note on why it matters.',
      },
      {
        id: 'hs-placeholder-2',
        title: 'Placeholder — a financial aid resource',
        type: 'article',
        tags: ['financial aid'],
        note: 'Placeholder entry. Replace with a real resource and your own note on why it matters.',
      },
    ],
  },
  {
    id: 'college',
    name: 'College',
    subtitle: 'Making the most of it',
    intro:
      'This is a starting scaffold — swap these in for the clubs, research opportunities, and habits that actually moved the needle for you in college.',
    items: [
      {
        id: 'college-placeholder-1',
        title: 'Placeholder — a student organization',
        type: 'organization',
        tags: ['community'],
        note: 'Placeholder entry. Replace with a real organization and your own note on why it matters.',
      },
      {
        id: 'college-placeholder-2',
        title: 'Placeholder — a research or lab opportunity',
        type: 'program',
        tags: ['research'],
        note: 'Placeholder entry. Replace with a real opportunity and your own note on why it matters.',
      },
    ],
  },
  {
    id: 'internships-fellowships',
    name: 'Internships & Fellowships',
    subtitle: 'Real-world experience',
    intro:
      "This is a starting scaffold — swap these in for the internships and fellowships worth a student's time, plus what actually happens once they get in.",
    items: [
      {
        id: 'if-placeholder-1',
        title: 'Placeholder — a fellowship program',
        type: 'fellowship',
        tags: ['fellowship'],
        note: 'Placeholder entry. Replace with a real fellowship and your own note on why it matters.',
      },
      {
        id: 'if-placeholder-2',
        title: 'Placeholder — where to find internships',
        type: 'tool',
        tags: ['internships'],
        note: 'Placeholder entry. Replace with a real tool or site and your own note on why it matters.',
      },
    ],
  },
  {
    id: 'programs-orgs',
    name: 'Programs & Organizations',
    subtitle: 'Community and support',
    intro:
      'This is a starting scaffold — swap these in for the organizations and communities that gave you a foothold.',
    items: [
      {
        id: 'po-placeholder-1',
        title: 'Placeholder — a professional organization',
        type: 'organization',
        tags: ['community'],
        note: 'Placeholder entry. Replace with a real organization and your own note on why it matters.',
      },
      {
        id: 'po-placeholder-2',
        title: 'Placeholder — a scholarship program',
        type: 'scholarship',
        tags: ['funding'],
        note: 'Placeholder entry. Replace with a real scholarship and your own note on why it matters.',
      },
    ],
  },
];
```

- [ ] **Step 2: Write `src/content/resources.test.ts`**

```ts
import { resourceStages } from './resources';

describe('resource stages data', () => {
  it('exports exactly the 4 expected stages, in order', () => {
    expect(resourceStages.map((s) => s.id)).toEqual([
      'high-school',
      'college',
      'internships-fellowships',
      'programs-orgs',
    ]);
  });

  it('every stage has required fields and at least one item', () => {
    for (const stage of resourceStages) {
      expect(stage.name).toBeTruthy();
      expect(stage.subtitle).toBeTruthy();
      expect(stage.intro).toBeTruthy();
      expect(stage.items.length).toBeGreaterThan(0);
    }
  });

  it('every item has required fields', () => {
    for (const stage of resourceStages) {
      for (const item of stage.items) {
        expect(item.id).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.type).toBeTruthy();
        expect(item.note).toBeTruthy();
      }
    }
  });

  it('every item id is unique across all stages', () => {
    const ids = resourceStages.flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

- [ ] **Step 3: Run the new test and confirm it passes**

Run: `npm run test -- src/content/resources.test.ts`
Expected: 4 tests pass (this is new code with no prior failing state to check — the test is exercising real, already-written data, so there's no red step here; just confirm green).

- [ ] **Step 4: Add exports to `src/content/index.ts`**

Read the file first (already read during planning — current contents end at `export type { ResearchEntry } from './research';`). Append:

```ts
export { resourceStages } from './resources';
export type { ResourceItem, ResourceItemType, ResourceStage, ResourceStageId } from './resources';
```

- [ ] **Step 5: Typecheck and commit**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

```bash
git add src/content/resources.ts src/content/resources.test.ts src/content/index.ts
git commit -m "feat(resources): add resource stage/item content data"
```

---

## Task 2: Presentational pieces (`ResourcesStatic.tsx`)

**Files:**

- Create: `src/components/features/worlds/resources/ResourcesStatic.tsx`

**Interfaces:**

- Consumes: `ResourceItem`, `ResourceItemType`, `ResourceStage` from `@/content/resources` (Task 1). `HubSocials` from `@/components/features/hub/HubSocials` — props `accentColor: string`, `accentRgb: string`, `layout: 'inline' | 'fixed'` (confirmed from existing usage in `StudentStatic.tsx`).
- Produces (all consumed by Task 3's `ResourcesShell.tsx`):
  - `WORLD_NAME: string` (`'Resources'`)
  - `WORLD_COLOR: string` (`'#f59e0b'`)
  - `ACCENT: string` (`'245, 158, 11'` — the `r, g, b` triplet matching `WORLD_COLOR`)
  - `eyebrow: string` (Tailwind class string)
  - `ResourceTypeBadge({ type: ResourceItemType })`
  - `TagChips({ tags: string[] })`
  - `Socials()`
  - `StageCardBody({ stage: ResourceStage })`
  - `ItemCardBody({ item: ResourceItem })`
  - `ExternalLinkButton({ url: string })`

This file carries no `'use client'` directive — none of its pieces use hooks or event handlers; the click behavior is added by whichever button/element wraps them in `ResourcesShell.tsx`.

- [ ] **Step 1: Write the file**

```tsx
import HubSocials from '@/components/features/hub/HubSocials';
import type { ResourceItem, ResourceItemType, ResourceStage } from '@/content/resources';

export const WORLD_NAME = 'Resources';
export const WORLD_COLOR = '#f59e0b';
/** `r, g, b` triplet matching WORLD_COLOR — feeds `--world-color-rgb` and every
 *  `rgba(${ACCENT}, ...)` usage below. */
export const ACCENT = '245, 158, 11';

export const eyebrow = 'mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45';

const TYPE_LABELS: Record<ResourceItemType, string> = {
  program: 'Program',
  scholarship: 'Scholarship',
  fellowship: 'Fellowship',
  organization: 'Organization',
  tool: 'Tool',
  article: 'Article',
};

export function ResourceTypeBadge({ type }: { type: ResourceItemType }) {
  return (
    <span
      className="rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
      style={{ background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }}
    >
      {TYPE_LABELS[type]}
    </span>
  );
}

export function TagChips({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="border-white/8 rounded-lg border bg-white/[0.03] px-2.5 py-1 text-xs text-white/75"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function Socials() {
  return (
    <div className="mt-auto flex justify-center pt-2">
      <HubSocials accentColor={WORLD_COLOR} accentRgb={ACCENT} layout="inline" />
    </div>
  );
}

/** A stage tile shown on the hub view. The click behavior is added by the button
 *  that wraps this in ResourcesShell. */
export function StageCardBody({ stage }: { stage: ResourceStage }) {
  return (
    <div className="p-5">
      <p
        className="font-mono text-[10px] uppercase tracking-[0.3em]"
        style={{ color: `rgb(${ACCENT})` }}
      >
        {stage.subtitle}
      </p>
      <h3 className="mt-2 text-lg font-bold text-white">{stage.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{stage.intro}</p>
      <span
        className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold"
        style={{ color: `rgb(${ACCENT})` }}
      >
        {stage.items.length} {stage.items.length === 1 ? 'resource' : 'resources'}{' '}
        <span aria-hidden>&rarr;</span>
      </span>
    </div>
  );
}

/** A resource card shown inside a stage view. The click behavior is added by the
 *  button that wraps this in ResourcesShell. */
export function ItemCardBody({ item }: { item: ResourceItem }) {
  return (
    <div className="p-5">
      <ResourceTypeBadge type={item.type} />
      <h3 className="mt-2 text-base font-bold text-white">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{item.note}</p>
      {item.tags?.length ? (
        <div className="mt-3">
          <TagChips tags={item.tags} />
        </div>
      ) : null}
      <span
        className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold"
        style={{ color: `rgb(${ACCENT})` }}
      >
        Read more <span aria-hidden>&rarr;</span>
      </span>
    </div>
  );
}

export function ExternalLinkButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 font-mono text-xs font-semibold transition-colors"
      style={{ borderColor: `rgba(${ACCENT}, 0.4)`, color: `rgb(${ACCENT})` }}
    >
      Visit resource <span aria-hidden>&#8599;</span>
    </a>
  );
}
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors. (No test for this file — it's pure presentation with no branching logic worth a unit test, consistent with `StudentStatic.tsx`/`GarageStatic.tsx` having none either.)

- [ ] **Step 3: Commit**

```bash
git add src/components/features/worlds/resources/ResourcesStatic.tsx
git commit -m "feat(resources): add resources presentational pieces"
```

---

## Task 3: Client shell (`ResourcesShell.tsx`)

**Files:**

- Create: `src/components/features/worlds/resources/ResourcesShell.tsx`

**Interfaces:**

- Consumes:
  - `ResourceStage` type from `@/content/resources` (Task 1).
  - `WORLD_NAME`, `WORLD_COLOR`, `ACCENT`, `eyebrow`, `ResourceTypeBadge`, `TagChips`, `Socials`, `StageCardBody`, `ItemCardBody`, `ExternalLinkButton` from `./ResourcesStatic` (Task 2).
  - `TrifoldLayout` (default export) from `@/components/features/hub/trifold/TrifoldLayout` — props `colorRgb: string`, `left/center/right: TrifoldSlot`, `lead?: ReactNode` (confirmed from `StudentShell.tsx`/`TrifoldLayout.tsx`).
  - `IslandChat` (default export) from `@/components/features/hub/LazyIslandChat` — props `accentColor: string`, `accentRgb: string`, `isMobile?: boolean`, `defaultMinimized?: boolean` (confirmed from `IslandChat.tsx`).
  - `useIsMobile` from `@/hooks/useIsMobile` — returns `boolean`.
- Produces: `ResourcesShell` (default export), props `{ stages: ResourceStage[] }`. Consumed by Task 4's `src/app/resources/page.tsx`.

- [ ] **Step 1: Write the file**

```tsx
'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';

import IslandChat from '@/components/features/hub/LazyIslandChat';
import TrifoldLayout from '@/components/features/hub/trifold/TrifoldLayout';
import type { ResourceStage } from '@/content/resources';
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
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const stage = stages.find((s) => s.id === selectedStageId) ?? null;
  const item = stage?.items.find((i) => i.id === selectedItemId) ?? null;

  // Reset scroll position on every view change.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [selectedStageId, selectedItemId]);

  const enterStage = (id: string) => {
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
    <div ref={scrollRef} className="lg:h-full lg:overflow-y-auto">
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
          className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
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
```

- [ ] **Step 2: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/features/worlds/resources/ResourcesShell.tsx
git commit -m "feat(resources): add resources trifold shell"
```

---

## Task 4: Route (`/resources`)

**Files:**

- Create: `src/app/resources/page.tsx`

**Interfaces:**

- Consumes: `resourceStages` from `@/content/resources` (Task 1); `ResourcesShell` (default export) from `@/components/features/worlds/resources/ResourcesShell` (Task 3), prop `stages: ResourceStage[]`.

- [ ] **Step 1: Write the file**

```tsx
import type { Metadata } from 'next';

import ResourcesShell from '@/components/features/worlds/resources/ResourcesShell';
import { resourceStages } from '@/content/resources';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Career advice, programs, and opportunities for students — organized by stage, with personal notes on each.',
  alternates: { canonical: '/resources' },
  openGraph: {
    title: 'Resources — Jossue Sarango',
    description: 'Career advice, programs, and opportunities for students.',
    url: '/resources',
  },
};

export default function ResourcesPage() {
  return <ResourcesShell stages={resourceStages} />;
}
```

- [ ] **Step 2: Start the dev server and manually verify the route**

Run: `npm run dev` (in the background), then visit `http://localhost:3000/resources`.
Expected: the trifold renders with the amber "Resources" title, a "← Hub" link, and 4 stage cards (High School, College, Internships & Fellowships, Programs & Organizations) in the center panel. Clicking a stage card shows that stage's intro + 2 placeholder resource cards; clicking a resource card shows its detail (title, badge, note, tags). Both back buttons work. Stop the dev server after verifying.

- [ ] **Step 3: Typecheck, lint, and build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: no errors; build output includes a prerendered `/resources` route.

- [ ] **Step 4: Commit**

```bash
git add src/app/resources/page.tsx
git commit -m "feat(resources): add /resources route"
```

---

## Task 5: Nav integration

**Files:**

- Modify: `src/components/features/hub/trifold/IslandListPanel.tsx`

**Interfaces:**

- No new exports/consumers — this task only adds a nav row + icon inside the existing `IslandListPanel` component.

- [ ] **Step 1: Add a `ResourcesIcon` function**

In `src/components/features/hub/trifold/IslandListPanel.tsx`, add this function after `BlogIcon` (which ends at line 48) and before the component's doc comment:

```tsx
function ResourcesIcon() {
  return (
    <svg {...iconBase} className="h-5 w-5 flex-shrink-0">
      <circle cx="12" cy="12" r="9" />
      <path d="m14.5 9.5-1.8 4.8-4.8 1.8 1.8-4.8 4.8-1.8Z" />
    </svg>
  );
}
```

- [ ] **Step 2: Add the "Resources" nav row**

Replace:

```tsx
        <Link
          href="/blog"
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-base font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white"
        >
          <BlogIcon />
          Blog
        </Link>
        <Link
          href="/book"
```

with:

```tsx
        <Link
          href="/blog"
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-base font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white"
        >
          <BlogIcon />
          Blog
        </Link>
        <Link
          href="/resources"
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-base font-medium text-white/65 transition-colors hover:bg-white/5 hover:text-white"
        >
          <ResourcesIcon />
          Resources
        </Link>
        <Link
          href="/book"
```

- [ ] **Step 3: Update the component doc comment**

Replace:

```tsx
/**
 * Left rail: plain "Home", "Blog", and "Book a call" nav rows at the top
 * (icon + text, no background) and the chat filling the middle.
 */
```

with:

```tsx
/**
 * Left rail: plain "Home", "Blog", "Resources", and "Book a call" nav rows at
 * the top (icon + text, no background) and the chat filling the middle.
 */
```

- [ ] **Step 4: Start the dev server and manually verify**

Run: `npm run dev` (in the background), visit `http://localhost:3000/`.
Expected: the left rail shows Home, Blog, Resources, Book a call in that order; clicking "Resources" navigates to `/resources`. Stop the dev server after verifying.

- [ ] **Step 5: Typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/features/hub/trifold/IslandListPanel.tsx
git commit -m "feat(resources): add Resources link to the nav rail"
```

---

## Task 6: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Run the full test suite**

Run: `npm run test`
Expected: all tests pass, including the 4 new `resources.test.ts` cases from Task 1.

- [ ] **Step 2: Run lint, typecheck, and build**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: no errors; `/resources` appears as a prerendered route in the build output.

- [ ] **Step 3: Manual smoke test of the full flow**

Run: `npm run dev` (in the background). In a browser:

1. Visit `/`, click "Resources" in the left rail → lands on `/resources` with the hub view.
2. Click each of the 4 stage cards in turn → each shows its intro + its 2 placeholder items, and the "← Resources" back button returns to the hub.
3. Click a resource item → shows its detail view (title, badge, note, tags — no link button, since placeholder items have no `url`), and the "← [Stage name]" back button returns to that stage.
4. Confirm keyboard navigation: Tab reaches every stage/item card and both back buttons; Enter/Space activates them; focus rings are visible.
5. Resize to a mobile width (or use device toolbar) and confirm the trifold stacks and remains usable.

Stop the dev server after verifying.

No follow-up commit for this task — it's a verification gate, not a code change.
