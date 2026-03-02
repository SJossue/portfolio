# Spec: Garage Shell Overlay

## Goal

Create the visual foundation of the cyberpunk garage UI.

## Requirements

- When introState is "done" or "skipped":
  - Show overlay container:
    <div data-testid="garage-shell">
- Overlay layout:
  - Left panel placeholder (terminal area)
  - Right panel placeholder (project modules)
- Use Tailwind for layout
- Do not implement real AI yet
- Keep purely presentational

## Acceptance Criteria

- Overlay hidden during intro
- Visible after skip
- Playwright test verifies garage-shell appears after skip
- npm run validate passes
- Risk: medium
