# Timeline / Experience Page Redesign

**Date:** 2026-07-18
**Status:** Approved (design) — pending implementation plan
**Scope:** `/timeline` island page — middle, left, and right panels

## Problem

The `/timeline` page renders through the generic `IslandShell` scaffold and shows
ten role cards as a single, flat, visually-equal scroll. Three weaknesses:

1. **Flattening.** The roles span genuinely different arenas — hands-on
   engineering (HFR robotics, Baja FEA), corporate program management (PSEG),
   and leadership/service fellowships (Governor's Fellow, MLT, SHPE VP). One
   undifferentiated stream buries the strongest argument the page can make for a
   hardware-product-management candidate: proven breadth across _building_,
   _managing_, and _leading_.
2. **Low-signal filler.** The "Recurring Themes" section auto-dumps every unique
   `techStack` string as chips — noise, not signal.
3. **Visual gap with the garage.** The recently-redesigned `/garage` uses brand
   logos, curated hierarchy, and imagery. The timeline page looks a generation
   behind it.

This redesign closes the gap **without** forcing the garage's per-item
detail-swap interaction, because experience roles lack the media (heroes,
galleries) that justified detail views for projects. The value here comes from
_structure and polish_, not click-to-expand chrome.

## Goals

- Group roles into two honest sections that tell the trajectory story.
- Bring the garage's visual language (real org logos, curated hierarchy,
  current-role emphasis) to the timeline.
- Move the page's title/description into the left rail (already done in a prior
  task) and add the AI assistant to the bottom of the left rail.
- Replace the generic right aside with experience-specific stats.
- Keep it a single honest scroll — no empty/fabricated detail panels.

## Non-Goals

- No per-role detail-swap view (deferred; the `images` field stays in the data
  model so it remains forward-compatible if roles later earn real media).
- No new routes, no route changes.
- No rewrite of role copy — only re-tagging and presentation.

## Design

### 1. Data model — `src/content/experience.ts`

Add one field to `ExperienceEntry`:

- `section: 'experience' | 'leadership'` — which band the role belongs to.

Keep the existing optional `logo?: string` (path to a real logo asset under
`public/`). Derive "is this a current role?" from `period` including the string
`"Present"` — no new field.

Tag the ten entries:

| id                  | role                           | section    |
| ------------------- | ------------------------------ | ---------- |
| hfr                 | Robotics Engineering Intern    | experience |
| pseg                | Project Management Intern      | experience |
| baja                | Vehicle Systems Engineer       | experience |
| pseg-public-affairs | Regional Public Affairs Intern | experience |
| shpe                | Internal Vice President        | leadership |
| mlt                 | CareerPrep Fellow              | leadership |
| team                | Outreach Coordinator           | leadership |
| senate              | Internal/External Affairs      | leadership |
| firstgenu           | FirstGenU Fellow               | leadership |
| nj-gov              | New Jersey Governor's Fellow   | leadership |

**Ordering:** within each section, most-recent-first (reverse chronological,
résumé-style). Derived from `period` start date; if a stable sort key is needed,
add an explicit `order` per section during implementation rather than parsing
dates at render time.

### 2. Left rail — `IslandTOC` (via `IslandShell`)

Already done in a prior task: heading **MY TIMELINE** + description blurb moved
here as the `intro`.

Changes for this redesign:

- Section nav becomes **Experience · Leadership** (the `sections` export drives
  this; "Recurring Themes" is removed).
- **AI assistant pinned to the bottom** of the left rail. Reuse the existing
  `IslandChat` component, pinned with `mt-auto pt-2`, general-scoped (no
  `projectId`, so its default suggestions — including "Walk me through your
  experience." — apply). `isMobile` / `defaultMinimized={isMobile}` matching the
  garage's placement. Accent = timeline world color (`#8b5cf6`).

Placement note: the left rail is a flex column (`flex h-full flex-col`) inside a
panel that scrolls on desktop (`lg:overflow-y-auto`), so pinning chat at the
bottom with `mt-auto` is safe — it can't clip the nav.

### 3. Middle panel — `TimelineIsland`

Two bands rendered in order — **Experience**, then **Leadership** — each an
`IslandSection` whose `id` matches the left-rail nav (`experience`,
`leadership`). Each band is a vertical timeline rail (reuse the existing accent
left-border rail + dot treatment).

Per-card upgrades (new `ExperienceItem` layout):

- **Real org logo.** Each card leads with the organization's logo, sourced from
  `entry.logo` (a real image asset under `public/experience/…`). When `logo` is
  absent, fall back to a **monogram tile** — a rounded accent chip with the org's
  initials — so the layout never breaks while a logo is pending. Logos render at
  a fixed box (e.g. 40–48px) with `object-contain` on a neutral tile so
  mismatched aspect ratios stay tidy.
- **"Now" marker on current roles.** Roles whose `period` contains "Present" get
  a small pulsing accent dot + "NOW" label, so "who I am today" reads instantly
  without a separate featured band.
- Keep role / company / period / description / achievement bullets / techStack
  chips, restyled to sit alongside the logo.

Remove the "Recurring Themes" section entirely.

### 4. Right aside — timeline `children` block in `IslandAside`

`IslandAside` already renders world `highlights` + `stats` + socials and accepts
a `children` slot rendered between stats and socials. Pass a timeline-specific
block through that slot with **experience-specific stats**:

- **Years building · Roles held · Organizations · Teams led**

Plus a short **curated "threads"** list (3–4 hand-picked recurring strengths,
e.g. "Cross-functional leadership", "Hardware + software", "Public service") —
replacing the auto-dumped themes with intentional signal.

The generic `world.stats` in `worlds.ts` may be updated to match (Roles, Years),
or the richer stats live only in the timeline `children` block — decided during
implementation to avoid duplicating numbers.

### Logo sourcing

Real logos preferred (user decision). Source online where available; fall back to
monogram tile otherwise. Store under `public/experience/<id>.<ext>`.

| Org                                     | Expected source        |
| --------------------------------------- | ---------------------- |
| PSEG                                    | online (well-known)    |
| SHPE                                    | online (national org)  |
| Management Leadership for Tomorrow      | online                 |
| America Needs You                       | online                 |
| State of New Jersey (Governor's Fellow) | online (state seal)    |
| Human Friendly Robotics                 | ask user (early-stage) |
| Baja SAE at NJIT / Highlander Racing    | ask user / NJIT        |
| NJIT T.E.A.M.                           | ask user (internal)    |
| NJIT Student Senate                     | ask user / NJIT        |

Any org whose logo cannot be sourced ships with the monogram fallback and is
flagged to the user to supply.

## Files Touched

- `src/content/experience.ts` — add `section` field, tag entries, set logo paths.
- `src/components/features/worlds/timeline/TimelineIsland.tsx` — two-band render,
  new `ExperienceItem` with logo + "Now" marker, drop Recurring Themes, update
  `sections` export.
- `src/app/timeline/page.tsx` — pass a timeline `children` block into
  `IslandAside`; add `IslandChat` to the left rail (via `IslandShell` intro/rail
  or a small shell prop — see Open Questions).
- `public/experience/*` — logo assets.
- Possibly `src/content/worlds.ts` — align timeline `stats`.
- `src/components/features/worlds/shared/IslandShell.tsx` / `IslandTOC.tsx` —
  add a slot for the pinned AI assistant in the left rail (see Open Questions).

## Open Questions (resolve in the plan)

1. **How the AI assistant reaches the left rail.** `IslandShell` builds the left
   panel from `IslandTOC`. Options: (a) add an optional `railFooter`/`chat` prop
   threaded `IslandShell → IslandTOC`, rendered with `mt-auto`; (b) render chat
   in `IslandTOC` directly gated on `worldId === 'timeline'`. (a) is cleaner and
   reusable across islands — recommended.
2. **Stat source of truth** — timeline `children` block vs. `worlds.ts stats`
   (avoid showing two different role counts).

## Testing

- Update/extend timeline-related tests for the two-section grouping and the
  presence of both bands.
- Snapshot/interaction: left-rail nav lists Experience + Leadership and
  scroll-spies to each band; AI assistant mounts at the bottom of the left rail.
- Accessibility: logos have `alt` text (org name); "NOW" marker is not
  color-only (has a text label); monogram fallback is `aria-hidden` with the org
  name available via the adjacent company text.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`.

## Rollout

Single PR, tight scope. Conventional Commits. No ADR needed (no new dependency,
no architectural boundary change — reuses existing `IslandShell`, `IslandChat`,
`IslandAside`).
