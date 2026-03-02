# Spec: 3D Scene Skeleton + Intro Controls

## Goal

Create the foundational 3D scene system with placeholders so we can later drop in the car GLB and GSAP "air out" timeline.

## Non-goals

- Do NOT add real car models yet.
- Do NOT implement complex lighting/postprocessing.
- Do NOT add AI terminal yet.

## UX Requirements

- Home route renders a fullscreen hero with:
  - "AIR OUT" primary action
  - "Skip Intro" secondary action
  - Reduced motion support (if prefers-reduced-motion, skip animations by default)
- After skipping or completing intro, show a basic "garage UI shell" overlay.

## Technical Requirements

- Add feature module under: `src/components/features/scene/`
- Introduce a minimal Zustand store:
  - `introState`: "idle" | "animating" | "skipped" | "done"
- Use placeholder geometry (box for chassis, cylinders for wheels).
- Add a simple camera position change when AIR OUT is pressed (can be a basic R3F lerp first, GSAP later).

## Acceptance Criteria

- [ ] Unit test exists verifying Home page renders key controls
- [ ] Playwright smoke test verifies the page loads and buttons exist
- [ ] `npm run validate` passes
- [ ] PR includes screenshot of both states (before/after intro)
- [ ] Risk label: medium
