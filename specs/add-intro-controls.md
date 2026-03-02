# Spec: Add Intro Controls (AIR OUT + Skip Intro)

## Goal

Add visible intro controls over the scene.

## Requirements

- Add two buttons:
  - AIR OUT
  - Skip Intro
- Buttons live inside HomeScene overlay
- Clicking AIR OUT:
  - set introState to "animating"
  - after 1 second (temporary), set to "done"
- Clicking Skip Intro:
  - set introState to "skipped"
- Add data-testid attributes:
  - data-testid="air-out"
  - data-testid="skip-intro"

## Acceptance Criteria

- Buttons visible on load
- State transitions update correctly
- Unit test verifies buttons render
- npm run validate passes
- Risk: medium
