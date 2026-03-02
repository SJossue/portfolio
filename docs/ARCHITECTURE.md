# Architecture Overview

## Goals

- Keep route architecture simple and scalable.
- Separate reusable UI primitives from feature-specific composition.
- Make repository structure obvious for humans and coding agents.
- Preserve performance and accessibility by default.

## High-level structure

- `src/app`: Next.js App Router entry point.
- `src/components/ui`: shared presentational components.
- `src/components/features`: domain features and composed components.
- `src/lib`: framework-agnostic helpers, config, constants.
- `src/styles`: global and design-system-adjacent styles.
- `src/content`: future content source directory.
- `src/types`: shared application type definitions.

## Why this split

- App Router keeps routing and layout concerns centralized.
- UI vs features split prevents business logic from leaking into primitives.
- `lib` isolates utility logic for easier testing and reuse.
- Dedicated docs + ADRs provide durable context for agentic workflows.

## Testing strategy

- Unit/integration: Vitest + Testing Library for fast feedback.
- End-to-end: Playwright scaffold for critical path confidence.
- CI gates: lint + typecheck + unit tests + build on every push/PR to `main`.

## Evolution strategy

- Add feature modules incrementally under `src/components/features`.
- Introduce content model in `src/content` before integrating CMS.
- Evaluate advanced motion/3D in isolated boundaries with explicit performance checks.
