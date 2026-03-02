# Common Workflows

## Add a new page/route

1. Create `src/app/<route>/page.tsx`.
2. Add metadata export if route needs SEO override.
3. Compose page with `ui` and `features` components.
4. Add tests:
   - unit test for route logic or critical rendering
   - e2e test if route is primary user flow
5. Run `npm run validate` before opening PR.

## Add a new UI component

1. Create component in `src/components/ui`.
2. Keep it presentational and prop-driven.
3. Add/adjust tests in colocated `*.test.tsx`.
4. Ensure component has accessible labels/roles as needed.
5. Run `npm run lint && npm run test`.

## Add a new animation/motion

1. Define UX reason for motion in PR description.
2. Provide reduced-motion fallback (`prefers-reduced-motion`).
3. Keep animation localized to feature boundaries.
4. Test performance impact on mobile viewport.
5. Validate no layout shift regressions.

## Add analytics later (placeholder workflow)

1. Create ADR describing provider choice and data governance.
2. Add analytics adapter in `src/lib/analytics` to avoid vendor lock-in.
3. Gate analytics initialization by environment and consent policy.
4. Add event naming conventions doc in `docs/`.
5. Add tests/mocks for instrumentation calls.
