# Contributing Guide

## Prerequisites

- Node.js from `.nvmrc`
- npm `>=10`

## Setup

```bash
nvm use
npm install
npm run prepare
npx playwright install --with-deps chromium
```

## Required checks before PR

```bash
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
```

## Adding a new route

1. Create route entry under `src/app/<route>/page.tsx`.
2. Prefer server components by default.
3. Export route-specific metadata if needed.
4. Add unit tests for route logic and e2e coverage when route is user-critical.

## Adding a new component

1. Put reusable presentational pieces in `src/components/ui`.
2. Put domain/feature-specific composition in `src/components/features`.
3. Keep props explicit and typed; avoid `any`.
4. Add tests for behavior that can regress.

## Code review expectations

- Small, focused PRs with clear intent.
- Explain tradeoffs for architectural decisions.
- Reference relevant ADRs when touching structure or tooling.
- Use Conventional Commits for commit messages.
