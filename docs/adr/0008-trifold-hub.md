# ADR 0008: Trifold Spatial Hub

**Status**: Accepted
**Date**: 2026-06-28

## Context

The homepage (`/`) was `HubCarousel` — a one-island-at-a-time experience:
a horizontal slide carousel on desktop and a vertical snap-scroll on mobile,
layered over a WebGL `Aurora` gradient plus an OGL `Particles` field. Reading
the full set of islands required paging through them one by one, and the two
always-on WebGL layers ran on the critical path of the landing route.

We want the landing page to present all four islands at once in a calm,
spatial layout — inspired by visionOS "liquid glass" surfaces — while keeping
the proven per-world deep-dive (`/garage`, `/timeline`, `/student`,
`/real-me`) untouched.

## Decision

Replace `HubCarousel` with a **trifold spatial hub** (`TrifoldHub`): three
floating glass panels over a flat background.

- **Left** (`IslandListPanel`) — a clickable list of all four islands; the
  selected row carries the world accent and `aria-current`.
- **Center** (`IslandStagePanel`) — the selected island visual (reuses the
  existing `IslandScene`), its name/subtitle/description, stat pills, and the
  primary **Enter** action.
- **Right** (`IslandDetailsPanel`) — the selected island's highlights, stats,
  "+N more inside", and (for `real-me`) contact links.

Selecting an island in the left list updates the center + right panels and
shifts the `--world-color-rgb` accent. On screens below `lg` the three panels
stack into a single scrollable column.

### Architecture

- `src/components/ui/GlassPanel.tsx` — a framework-agnostic presentational
  primitive (a stronger variant of `.glass-card`). Visuals live in the
  `.glass-panel` class in `globals.css`; layout is passed via `className`.
  No domain logic, per `docs/ARCHITECTURE.md`.
- `src/components/features/hub/trifold/` — the orchestrator and the three
  panels plus `HubBackground` (the swappable background layer).
- The Enter deep-dive is unchanged: `TrifoldHub` reuses the `enterWorld`
  flow (`useWorldLoader().start(id)` → `requestAnimationFrame` →
  `router.push(slug)`) and the existing `WorldLoader` (ADR 0006).

### Background

The background is a plain green placeholder isolated in `HubBackground.tsx`
(single `BG` constant). A future room-scene image swaps in there as a
one-file change.

### Dropping WebGL on the homepage

`Aurora` and `Particles` are no longer mounted on `/`. The homepage now ships
no `<canvas>`/WebGL on its critical path, which improves LCP and the initial
client-JS payload against the budgets in `docs/PROJECT.md` (≤200 KB initial
JS). The components remain in the repo for use elsewhere; the Hyperspeed
loader is still dynamically imported only when entering a world.

### Reduced motion

The panel crossfade is gated on `useReducedMotion`; the existing island tilt
and float already respect the preference. Reduced-motion users get instant,
static swaps.

## Alternatives Considered

1. **Keep the carousel, drop only WebGL** — solves the perf concern but not
   the "see everything at once" goal; paging remained the only way to browse.
2. **Selection in the center panel (carousel-in-glass)** — keeps a paging
   metaphor; rejected in favor of a reference-faithful clickable left list.
3. **Full room-scene background now** — deferred; the green placeholder keeps
   this change scoped to the layout/paradigm shift.

## Consequences

- `HubCarousel`, `HubNav`, and `IslandViewport` are removed (superseded; no
  dead code per `CLAUDE.md`). `IslandScene`, `IslandChat`, `HubSocials`,
  `CursorGlow`, and `WorldLoader` are retained and reused.
- The homepage E2E spec (`e2e/home.spec.ts`) was rewritten for the trifold
  (it previously asserted a stale garage-intro flow).
- Swapping in the room scene later touches only `HubBackground.tsx`.
