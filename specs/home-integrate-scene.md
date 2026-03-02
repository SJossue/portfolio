# Spec: Integrate SceneSkeleton into Home Route

## Goal

Wire the existing SceneSkeleton into src/app/page.tsx with a thin wrapper.

## Requirements

- Create src/components/features/scene/HomeScene.tsx
- HomeScene renders:
  - SceneSkeleton
  - Overlay container div (absolute positioned)
- Update src/app/page.tsx to render <HomeScene />
- Keep page.tsx thin (no logic)
- No config changes
- No new dependencies

## Acceptance Criteria

- Page loads without errors
- npm run validate passes
- Playwright still passes
- Risk: low
