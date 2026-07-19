# Mobile experience audit & fixes

**Date:** 2026-07-19
**Scope:** Phone- and tablet-facing rendering of the trifold hub and the four island
pages. One cohesive PR.

## Problem

The site is built on a shared `TrifoldLayout` (three glass panels: left rail, center
stage, right details). It was designed desktop-first; a mobile audit at 390px (phone)
and 820px (tablet) surfaced four issues, two of them outright breakage.

### Findings

1. **Tablet skew (768–1023px), site-wide.** `useIsMobile()` flips at 768px and gates
   the `rotateY(±13°)` perspective transform on the side panels, but the layout only
   switches from a stacked column to the side-by-side grid at Tailwind `lg` (1024px).
   In the 256px-wide band between, panels stack vertically _and_ still receive the
   desktop skew, so they render tilted and clipped off the left edge. Confirmed on the
   hub and every island page.

2. **Chat starts expanded on mobile, everywhere.** `IslandChat` initializes its view
   mode once from `defaultMinimized={isMobile}`, but `isMobile` is `false` on the first
   client render (it only flips true in a post-mount effect), so the `useState`
   initializer captures `false`. The chat opens expanded and never collapses to its
   FAB. On the hub this shoves the hero and island navigator below the fold; on content
   pages it wedges a large chat box between the section nav and the content.

3. **Hub information architecture is inverted on phones.** Stacked source order is
   left → center → right, so a phone visitor meets the nav rail + chat before the hero
   or the island navigator — the primary content is below the fold.

4. **Selected island card truncates on narrow phones.** The selected card renders a
   128px thumbnail + text + an "Enter →" pill; at 390px the text column collapses to
   ~80px, so "MY GARAGE / Projects & Craft" becomes "MY ... / Proj...".

Secondary: chat toolbar controls are 24px tap targets (below the 44px guideline);
`viewport-fit: cover` is set but safe-area insets are only applied to a legacy
`<header>` the trifold no longer uses; islands use a select-then-enter double-tap that
is unintuitive on touch.

## Design

### 1. Breakpoint integrity

- **Transform → CSS, gated on `lg`.** Remove the JS-driven inline `rotateY` from
  `TrifoldLayout` and express it as a `lg:`-gated utility so it exists only at ≥1024px,
  where the grid also lays panels side by side. This deletes the JS↔CSS desync class
  entirely; there is no longer a width band where the two disagree.
- **First-paint-correct `useIsMobile`.** Reimplement with `useSyncExternalStore` over a
  `matchMedia(max-width)` query so the client's first render already reads the real
  value (server snapshot stays `false`, avoiding hydration mismatch). This removes the
  flash-of-wrong-state for all ten consumers and is the root fix for finding #2.
- **Safe-area insets on the trifold root.** Pad the trifold container with
  `env(safe-area-inset-*)` so panels and the bottom socials clear the notch and home
  indicator under `viewport-fit: cover`.

### 2. Hub mobile IA

- **Reorder stacked panels, hub-scoped.** On mobile give the center panel (hero +
  islands) first order, right (hackathon/details) second, left (nav + chat) last. Reset
  to source order at `lg`. Scoped to the hub via per-slot mobile-order support on
  `TrifoldLayout` so island content pages keep their TOC-on-top ordering.
- **Fix card truncation.** On narrow widths shrink the thumbnail and let the "Enter →"
  pill wrap/relocate so the island name and subtitle never clip.

### 3. Touch & polish

- **Single-tap enters on touch.** On coarse pointers (`pointer: coarse`), one tap on an
  island enters that world directly — no preview/select step (there is no hover to
  preview with on touch). Keyboard select-then-Enter is unchanged.
- **Tap targets ≥44px on touch** for the chat toolbar and send/stop controls.
- Chat reliably minimized to its FAB on mobile (falls out of the `useIsMobile` fix).

## Non-goals

- No redesign of desktop layout or per-world content.
- `src/content/education.ts` stays held/unstaged (unrelated, awaiting the user's push
  authorization) and is excluded from every commit here.

## Verification

Per change and before the PR: `typecheck` → `lint --max-warnings=0` → unit tests →
`build` → phone (390px) and tablet (820px) screenshots of the hub and all four islands,
confirming no skew, hero-first hub, minimized chat, and untruncated cards. Update the
`home.spec.ts` mobile-stacking test if panel order changes affect its assertions.
