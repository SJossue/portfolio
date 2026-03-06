# Agent Execution Rules

- Respect architecture boundaries from `docs/ARCHITECTURE.md`.
- Use `src/components/ui` only for reusable presentational primitives.
- Keep feature/domain composition in `src/components/features`.
- Prefer server components; add client components only when required.
- Do not add dependencies without justification and an ADR when impact is long-term.
- Keep imports sorted and use path aliases from `tsconfig.json`.
- Add or update tests with behavior changes.
- Keep PR scope tight and focused.
- Use Conventional Commits.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` before merging.
- For substantial architectural/tooling decisions, add `docs/adr/XXXX-*.md` and update `docs/ADRS.md`.
- Preserve accessibility: semantic HTML, keyboard support, and visible focus states.
- Preserve performance posture from `docs/PROJECT.md` (LCP/CLS/bundle discipline).
- Avoid dead code, commented-out blocks, and broad refactors without explicit request.
- If a rule conflicts with a task, document the tradeoff in the PR.
