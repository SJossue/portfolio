# Resources — Career Advice, Programs & Opportunities

**Date:** 2026-07-23
**Status:** Proposed
**Scope:** `/resources` (new)

## Problem

There's no place on the site to point students to career advice, programs, and
opportunities worth discovering — the kind of curated list-plus-personal-commentary
seen on sites like Obolu Blueprint. It should feel native to this portfolio, not
bolted on: reuse the trifold "world" visual language already established by
Garage/Student/Timeline, without becoming a 5th tile in the homepage island
carousel (`worlds.ts` / `IslandSelector`).

## Approach

Add `/resources` as a standalone route reached from the left rail nav
(`IslandListPanel.tsx`), directly below "Blog" — same treatment as "Blog" and
"Book a call" (icon + label, plain link, no `WorldLoader` transition since it
isn't entered via the carousel).

Internally it's a bespoke `ResourcesShell` client component modeled directly on
`StudentShell` (self-contained; does **not** touch the shared
`IslandShell`/`IslandAside`/`IslandTOC`, which are wired to the `worlds.ts`
lookup) — reusing `TrifoldLayout`, `IslandChat`, and the site's glass-panel /
accent-color conventions. Gets its own accent color, amber/gold
(`#f59e0b`-ish), distinct from garage (orange) / timeline (purple) / student
(cyan) / real-me (green).

Content is organized as **stages**, matching the Obolu-style progression:
High School → College → Internships & Fellowships → Programs & Organizations.
Each stage carries a personal intro blurb (your own voice) and a list of
resource items; each item carries its own short personal note plus an optional
external link. This is one level deeper than Student/Garage's
overview-to-detail swap, so the shell manages two layers of client selection
state instead of one:

1. **Hub view** (default) — the 4 stages presented as cards in the center
   panel (visually echoing the homepage `IslandSelector` island cards: image
   tile + name + one-line description), each also showing its intro blurb.
2. **Stage view** — selecting a stage shows its full intro + its resource
   items as cards (title, type badge, tags, external-link affordance).
3. **Item view** — selecting a resource item shows the detail: your personal
   note in full, the resource's tags, and the outbound link.

All three are client-side state swaps within one route (no sub-routes),
mirroring how `StudentShell` swaps overview ↔ paper reading view without a
navigation.

## Design

### Data model — `src/content/resources.ts`

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
  url?: string;
  tags?: string[];
  /** Your personal take — why it's here, your experience with it. */
  note: string;
}

export interface ResourceStage {
  id: ResourceStageId;
  name: string;
  subtitle: string;
  /** Personal blurb introducing the stage, shown in both hub and stage views. */
  intro: string;
  items: ResourceItem[];
}

export const resourceStages: ResourceStage[] = [...];
```

Exported from `src/content/index.ts` alongside the other content modules.
Plain TS objects (no MDX) — keeps authoring lightweight, consistent with
`projects.ts` / `experience.ts`, and appropriate for short notes rather than
long-form prose.

### Left panel

- **Hub:** Hub link (`← Hub`, matches other worlds) · "Resources" title in the
  amber accent · short page-level intro · general `IslandChat` pinned to the
  bottom.
- **Stage:** "← Resources" back button · stage name · stage intro (shortened)
  · `IslandChat` (still general-scoped — no per-item chat, unlike Student's
  paper-scoped chat; not warranted for short link/notes content).
- **Item:** "← [Stage name]" back button · item title + type badge.

### Center panel

- **Hub:** 4 stage cards, each: image/color tile + name + subtitle + intro
  blurb excerpt + item count. Click enters the stage.
- **Stage:** stage intro (full) at top, then a grid/list of resource item
  cards (title, type badge, tags, "→" affordance). Click enters the item.
- **Item:** title + type badge + full personal note + tags + external link
  button (`target="_blank" rel="noopener noreferrer"`, opens the actual
  program/opportunity).

### Right panel

- **Hub:** aggregate stats (e.g. total resources, stage count) + socials.
- **Stage:** item count for this stage + tag cloud for the stage + socials.
- **Item:** the item's tags + link repeated as a button + socials.

### Nav icon

New icon in `IslandListPanel.tsx` (compass or bookmark glyph, matching the
existing inline-SVG icon style of `HomeIcon`/`BlogIcon`/`CalendarIcon`),
placed between "Blog" and "Book a call".

### Initial content

Scaffolded with a small number of clearly-placeholder entries per stage (e.g.
2 per stage) so the structure and UI are real and testable; real
programs/links/personal notes are filled in afterward as a content pass, not
part of this implementation.

## Accessibility & performance

- Keyboard: same arrow/enter patterns as `IslandSelector` for the hub's stage
  cards; stage/item card grids are simple tab-order `<button>`/`<a>` lists
  (no custom roving-tabindex needed at that scale).
- External links: `target="_blank" rel="noopener noreferrer"`, visually
  marked (e.g. small external-link glyph) so it's clear before navigating.
- Respects `prefers-reduced-motion` for the hub/stage/item transitions (reuse
  `useReducedMotion`, same as `StudentShell`).
- No new client bundle weight beyond what Student/Garage already pay for
  (`TrifoldLayout`, `IslandChat` are already loaded elsewhere) — `resources.ts`
  is a small static data module, server-rendered like the other content
  modules.

## Files

- `src/content/resources.ts` (new) — stage/item data; `resources.test.ts` (new).
- `src/content/index.ts` — export `resourceStages`, `ResourceStage`,
  `ResourceItem`, `ResourceItemType`.
- `src/components/features/worlds/resources/ResourcesShell.tsx` (new).
- `src/components/features/worlds/resources/ResourcesStatic.tsx` (new) —
  accent constants, card bodies, shared bits (mirrors `StudentStatic.tsx`).
- `src/components/features/worlds/resources/ResourcesSelectTrigger.tsx` (new)
  — client selection-state trigger (mirrors `StudentSelectTrigger.tsx`), or a
  small local selection store if two-level state doesn't fit that trigger's
  shape cleanly (decide during planning).
- `src/app/resources/page.tsx` (new).
- `src/components/features/hub/trifold/IslandListPanel.tsx` — add the
  "Resources" nav row + icon.

## Open questions for the plan

- Exact selection-state shape for the two nested levels (stage + item) —
  whether to extend the `StudentSelectTrigger`/Zustand-store pattern to carry
  both, or compose two independent stores.
- Card art for the hub's 4 stage tiles — reuse a solid accent-tinted panel
  (no `/islands/*.webp` image asset) since these aren't homepage worlds, unless
  real imagery is supplied later.
