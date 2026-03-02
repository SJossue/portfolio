# Agent Operating Manual

## Mission

Keep the repository stable, readable, and scalable while shipping incremental value.

## Branching model

- Branch from `main`.
- Use branch names: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`, `docs/<scope>`, `test/<scope>`.
- Keep branches short-lived and rebased regularly.

## Commit message standard

Use Conventional Commits:

- `feat: ...`
- `fix: ...`
- `chore: ...`
- `docs: ...`
- `test: ...`
- `refactor: ...`

Examples:

- `feat(home): add hero skeleton`
- `fix(nav): correct mobile focus trap`

## File and boundary rules

- `src/app`: routing and page-level composition only.
- `src/components/ui`: reusable, presentation-only components.
- `src/components/features`: feature/domain components.
- `src/lib`: pure utilities, config, constants.
- `src/content`: source-of-truth content as project grows.
- `src/types`: shared type contracts.

## Naming conventions

- Components: PascalCase file names for exported components.
- Hooks (future): `useX.ts`.
- Utilities: lowercase file names with clear intent.
- Tests: colocate as `*.test.ts(x)` near target module.

## PR checklist for agents

- [ ] Scope is minimal and aligned to issue/task.
- [ ] Imports are sorted and paths use aliases where appropriate.
- [ ] No dead code or commented blocks remain.
- [ ] Checks pass: lint, typecheck, unit tests, build.
- [ ] Docs/ADR updated when introducing new conventions or architecture shifts.

## Guardrails to prevent drift

- Prefer existing patterns over introducing new styles.
- Avoid adding dependencies unless there is measured value.
- Document any non-obvious decision in `docs/adr`.
- Preserve accessibility and performance baselines defined in `PROJECT.md`.
