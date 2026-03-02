# Spec: Reduced Motion Support

## Goal

Respect prefers-reduced-motion.

## Requirements

- On mount, check:
  window.matchMedia("(prefers-reduced-motion: reduce)")
- If true:
  - immediately set introState to "skipped"
- Do not use new libraries
- Keep logic inside HomeScene

## Acceptance Criteria

- No crash if matchMedia unavailable (SSR safe)
- npm run validate passes
- Risk: low
