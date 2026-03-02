# ADR 0001: Stack and Repository Structure

- Status: Accepted
- Date: 2026-03-01

## Context

The repository is intended for long-term, iterative portfolio development with contributions from multiple coding agents. It needs strict quality gates, predictable architecture boundaries, and fast developer feedback loops while remaining easy to deploy on Vercel.

## Decision

Adopt the following baseline:

- Framework: Next.js (App Router) with TypeScript in strict mode.
- Styling: Tailwind CSS for scalable utility-first styling.
- Lint/format: ESLint + Prettier with enforced import sorting.
- Git quality gates: Husky + lint-staged + commitlint.
- Unit testing: Vitest + Testing Library.
- E2E scaffold: Playwright.
- CI: GitHub Actions running lint, typecheck, tests, and build.
- Node version standardization: `.nvmrc` (`22`).

## Rationale

- Next.js App Router aligns with Vercel-first deployment and supports server-first rendering.
- Strict TypeScript and CI gates reduce regressions from multi-agent contributions.
- Tailwind provides a consistent style system with low ceremony.
- Vitest was chosen over Jest because:
  - Faster startup and execution in modern ESM/TS environments.
  - Simpler configuration with Vite ecosystem tooling.
  - Strong compatibility with Testing Library and jsdom.
  - Lower maintenance burden for an App Router codebase not relying on Jest-specific APIs.
- Playwright adds future-ready confidence for user-critical flows.

## Consequences

Positive:

- Clear project boundaries and contribution workflow.
- Fast unit test cycle and scalable lint/type gates.
- Good deployment alignment with Vercel.

Tradeoffs:

- Contributors familiar with Jest need to adapt to Vitest commands/mocks.
- Pre-commit typecheck may feel slow on very large future codebases; can be moved to pre-push if needed.
