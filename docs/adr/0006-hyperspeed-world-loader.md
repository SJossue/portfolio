# ADR 0006: Hyperspeed World Loader

**Status**: Accepted
**Date**: 2026-04-21

## Context

Each hub world (`/garage`, `/timeline`, `/student`, `/real-me`) ships a heavy
hero scene built with `@react-three/fiber`, custom shaders, and (in some
worlds) a GLB model. On a fresh navigation from the hub the destination
takes ~600–1500 ms to:

1. Code-split the world chunk.
2. Hydrate `WorldLayout` and the dynamic `*Hero3D` component.
3. Compile WebGL shaders / fetch + decode GLB models.

The previous transition (`WorldTransition.tsx`) ran a 0.6 s circle expand on
the hub side and called `router.push` only after the animation completed.
That meant the user saw a colored block, then a white/black flash, then the
world's own entry color-wash from `WorldLayout`. The result felt jarring on
slower devices and gave no sense of "loading."

## Decision

Replace `WorldTransition` with a global, persistent **WorldLoader** rendered
in the root layout. The hub triggers it via a Zustand store, navigates
immediately, and the destination world signals "ready" once its tree mounts.

### Architecture

- `src/components/ui/Hyperspeed/` — pure presentational primitive: faithful
  TypeScript port of the React Bits Hyperspeed effect (three.js +
  postprocessing). Strict public API; loose internal typing for the shader
  glue, matching the upstream JS reference.
- `src/lib/hyperspeed-presets.ts` — per-world color + distortion presets so
  each transition feels native to its destination (orange/turbulent for
  Garage, purple/long-race for Timeline, cyan/deep for Student, emerald/
  mountain for Real Me).
- `src/lib/world-loader-store.ts` — small Zustand store: `worldId`, `phase`
  (`idle | entering | ready`), `startedAt`, plus `start / markReady /
dismiss` actions.
- `src/components/features/hub/WorldLoader.tsx` — composer. Subscribes to
  the store, lazy-loads `Hyperspeed` (dynamic import, `ssr: false`), holds
  the loader visible for at least `MIN_DISPLAY_MS` (1600 ms) once the
  destination signals ready, then fades out over 600 ms.
- `WorldLayout` calls `markReady()` after two `requestAnimationFrame`s
  (chrome painted + dynamic chunks attached). A 6 s safety net forces
  dismiss if the destination never reports ready.

### Why Zustand

The loader has to outlive the hub's unmount during `router.push`, so the
trigger and the dismissal happen in different React trees. Zustand is
already a project dependency, has zero render overhead when subscribed
selectively, and works without provider plumbing in the App Router.

### Reduced motion

Users with `prefers-reduced-motion: reduce` get a calm flat-color overlay
plus the destination label — the Hyperspeed scene is skipped entirely so we
don't ship/run a WebGL pipeline against the user's preference.

### Bundle impact

`postprocessing` was already a transitive dep via `@react-three/postprocessing`
(ADR 0003). The Hyperspeed module is dynamically imported, so it only loads
the first time a world is entered.

## Alternatives Considered

1. **Keep WorldTransition + slower delay** — masks the perceived load but
   doesn't actually wait for the destination, so heavy worlds still flash.
2. **Suspense-based loading inside each world** — works for the 3D hero but
   not for the hub→world handoff, since the hub unmounts before destination
   suspense fallbacks render.
3. **Per-world loader components** — duplicates plumbing four times; the
   per-world flavor is cleanly captured by a preset table instead.

## Consequences

- One additional client component mounted in the root layout (renders
  `null` until triggered).
- Worlds can opt into earlier "ready" signals later by calling
  `useWorldLoader.markReady()` from inside their hero `<Canvas onCreated>`
  hook if more accurate timing is needed.
