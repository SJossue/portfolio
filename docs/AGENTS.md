# Agent Operating Manual (Low-Oversight)

## Required Reading

**Before making any changes, agents MUST read:**

1. [docs/ARCHITECTURE.md](./ARCHITECTURE.md) - File structure and component boundaries
2. [docs/PROJECT.md](./PROJECT.md) - Performance budgets and constraints
3. [docs/WORKFLOWS.md](./WORKFLOWS.md) - How to add features, routes, components
4. `specs/<task>.md` - The assigned feature specification

## Mission

Keep the repository stable, readable, and scalable while shipping incremental value with minimal human oversight.

## Branching + PR Rules

### Branching

- **Work must be done on a branch, never directly on main**
- Branch naming: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`, `docs/<scope>`, `test/<scope>`
- Keep branches short-lived and rebased regularly
- Example: `feat/skip-intro-toggle`, `fix/mobile-nav-focus`

### Pull Requests

Every change must be delivered as a PR with:

1. **Title**: Conventional commit style
   - `feat: add skip intro button`
   - `fix: correct mobile focus trap`
   - `chore: update playwright config`
   - `docs: clarify 3D asset workflow`
   - `test: add e2e for homepage`

2. **PR Description MUST include**:
   - Summary of changes (what and why)
   - **Risk label**: `🟢 low` | `🟡 medium` | `🔴 high`
   - Validation output (screenshot/paste of `npm run validate` passing)
   - Preview link (Vercel URL once available)
   - Screenshots/video if UI changed
   - Reference to spec if applicable

3. **Use the PR template**: [.github/pull_request_template.md](../.github/pull_request_template.md)

## Definition of Done

A task is ONLY "done" if:

1. ✅ `npm run validate` passes locally (or `just ci`)
2. ✅ PR is opened with complete description + evidence
3. ✅ All acceptance criteria from spec are met
4. ✅ Tests cover new behavior
5. ✅ No performance budgets violated (see [PROJECT.md](./PROJECT.md))
6. ✅ Accessibility requirements met (keyboard nav, ARIA, contrast)

**The single source of truth for "done":**

```bash
npm run validate
```

This command runs: lint → typecheck → test → build → e2e

## Failure Protocol (Stop Rules)

**Agents must STOP and open a WIP PR with notes if:**

1. ❌ `npm run validate` fails after **3 fix attempts**
   - Document what was tried, where stuck
   - Mark PR as draft, request human review

2. ❌ Required secret/credential is missing
   - Cannot proceed without API keys, etc.
   - Document what's needed in PR notes

3. ❌ Spec ambiguity prevents progress
   - Unclear requirements or conflicting constraints
   - Open draft PR with questions highlighted

4. ❌ Performance budget clearly broken and cannot be fixed quickly
   - Bundle size exceeded, LCP regression, etc.
   - Document the issue, suggest alternatives

5. ❌ Test failures unrelated to your changes
   - Flaky tests, environment issues
   - Note the issue, don't attempt to fix unrelated code

**When in doubt, stop early and ask for clarification.**

## Editing Discipline

### Keep PRs Small

- ✅ One feature/fix per PR
- ✅ Aim for < 500 lines changed (excluding generated code)
- ✅ Split large features across multiple PRs using specs

### Avoid Scope Creep

- ❌ Do not introduce massive refactors unless spec explicitly requests it
- ❌ Do not "improve" unrelated code while working on a task
- ❌ Do not add "nice to have" features not in the spec

### Dependencies

- ❌ **Do not introduce new libraries without:**
  1. Documenting in an ADR (`docs/adr/XXXX-*.md`)
  2. Updating [PROJECT.md](./PROJECT.md) "Forbidden Without ADR" section
  3. Justifying bundle size impact in PR description
- ✅ Prefer existing dependencies when possible
- ✅ Always check if native/existing solution works first

### Code Quality

- ✅ Imports must be sorted (enforced by ESLint)
- ✅ Use path aliases from `tsconfig.json` (`@/components`, `@/lib`, etc.)
- ✅ No dead code or commented-out blocks
- ✅ No console.log statements (use proper logging if needed)
- ✅ Follow existing code style in the file/feature

## Testing Requirements

**If you change behavior, add or update a test:**

### Unit/Integration Tests (Vitest + React Testing Library)

- Component behavior changes → add component tests
- Utility functions → add unit tests
- Colocate tests: `MyComponent.test.tsx` next to `MyComponent.tsx`

### E2E Tests (Playwright)

- New user-facing flows → add e2e smoke test
- Critical paths (auth, checkout, core UX) → must have e2e coverage
- Tests go in `e2e/**/*.spec.ts`

### Accessibility Tests

- New interactive components → test keyboard navigation
- Run axe-core checks in Playwright where applicable
- Manual screen reader testing documented in PR

## File and Boundary Rules

Follow [ARCHITECTURE.md](./ARCHITECTURE.md):

- `src/app/**` - Routing and page-level composition only (thin pages)
- `src/components/ui/**` - Presentational primitives only (no domain logic)
- `src/components/features/**` - Domain-specific components (3D scene, terminal, etc.)
- `src/lib/**` - Framework-agnostic utilities, config, constants
- `src/content/**` - Content source of truth
- `src/types/**` - Shared TypeScript type definitions

## Naming Conventions

- **Components**: PascalCase file names (`Button.tsx`, `SceneSkeleton.tsx`)
- **Hooks**: `useX.ts` (e.g., `useSceneState.ts`)
- **Utilities**: lowercase with clear intent (`cn.ts`, `format-date.ts`)
- **Tests**: Colocate as `*.test.ts(x)` near target module

## Performance & Accessibility Guardrails

**Always respect baselines from [PROJECT.md](./PROJECT.md):**

- ✅ LCP < 2.5s (p75)
- ✅ CLS < 0.1 (p75)
- ✅ Initial JS bundle ≤ 200 KB (gzipped)
- ✅ 3D assets ≤ 2 MB per model
- ✅ Keyboard navigation works
- ✅ Color contrast meets WCAG AA (4.5:1)
- ✅ Respects `prefers-reduced-motion`

**If your change violates a budget, it's not done.**

## Guardrails to Prevent Drift

1. **Prefer existing patterns** over introducing new styles
2. **Avoid architecture churn** - keep feature work incremental
3. **Document decisions** - add ADR for non-obvious choices
4. **Ask before refactoring** - only refactor if spec requires it
5. **Preserve baselines** - accessibility, performance, bundle size

---

**When in doubt: read the spec, check the docs, run `npm run validate`, open a draft PR with questions.**
