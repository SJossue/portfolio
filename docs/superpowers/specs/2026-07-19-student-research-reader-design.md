# The Student — Research Reader Redesign

**Date:** 2026-07-19
**Status:** Implemented
**Scope:** `/student` (The Student world)

## Problem

The student page was the least-developed of the four worlds. It used the generic
`IslandShell` + plain `IslandAside`, kept its title/description in the center
panel, had no AI assistant, and — most importantly — each research paper's full,
well-written markdown body (cited, ~2,000 words each) was **unreachable on-page**:
a visitor could only read it by downloading the PDF.

## Approach

Mirror the garage world. Convert `/student` from the generic shell into a custom
`StudentWorld` client component whose trifold swaps between an **overview** and a
per-paper **reading view** on click (no route change) — composing two patterns
that already exist in the codebase:

1. Garage's `selected`-state trifold swap (overview ↔ detail, item-scoped chat).
2. The blog's markdown rendering (`MDXRemote` + the styled `mdxComponents` map,
   already in the site's cyan voice — a match for the student accent).

The MDX-is-server / world-is-client tension is resolved by pre-rendering each
paper body in the server `page.tsx` and passing the finished nodes into the
client world as a `renderedPapers` prop.

## Design

### Left panel

- **Overview:** Hub link · world title · intro blurb (moved here from center) ·
  scroll-spy section nav (Overview / Research / Education & Focus) · general AI
  chat pinned to the bottom.
- **Detail:** "← Research" back button · paper index + title + topic chips ·
  **paper-scoped** AI chat (`projectId = paper.id`), so a reader can ask about
  the specific paper open in front of them.

### Center panel

- **Overview (single scroll):** the academic-side blurb → paper cards
  (hero + `PAPER · 0N` badge + hand-written summary + topic chips + "Read paper →")
  → Education & Focus.
- **Detail:** paper hero + the **full rendered paper body** + a "Download the full
  PDF" affordance.

### Right panel (custom — no auto-highlights)

- **Overview:** a 4-stat tally computed from the real bodies
  (3 papers · 7 topics · 6.3K words · 36 works cited), a "Focus" throughline
  block (the timeline-"Threads" analog), and socials.
- **Detail:** the paper's topics, a Download-PDF link, and socials.

### Education & Focus

Enriched from a single degree card to: degree card + GPA + expected graduation +
relevant coursework + honors/fellowships + the research-topic cloud. **GPA,
graduation term, and coursework render only when real values are present in
`education.ts`** — they are intentionally empty pending confirmation so nothing
fabricated ships. Honors are pre-filled from the three fellowships already on the
timeline (MLT, America Needs You / FirstGenU, NJ Governor's Fellow).

## Files

- `src/content/education.ts` (new) — academic data; `education.test.ts` (new).
- `src/content/research.ts` — optional `topics[]` per paper.
- `src/content/worlds.ts` — student stats → 4 real values.
- `src/content/index.ts` — export `educationData` / `EducationData`.
- `src/components/features/worlds/student/StudentWorld.tsx` (new) — the world.
- `src/components/features/worlds/student/StudentIsland.tsx` (removed).
- `src/app/student/page.tsx` — server MDX pre-render + `StudentWorld`.

## Verification

typecheck · lint (`--max-warnings=0`) · test (57 passing) · production build
(`/student` still statically prerendered) · Playwright screenshots of the
overview and a paper reading view (confirmed the full MDX body renders, chat
scopes to the paper, and the back button returns to the scroll).

## Follow-ups

- **Fill before merge:** real GPA, expected graduation term, and relevant
  coursework in `education.ts`.
- The paper-scoped chat's default suggestions come from `IslandChat`'s
  project-oriented set ("Which tools did you use?"); a research-tuned suggestion
  set could read more naturally, if desired.
