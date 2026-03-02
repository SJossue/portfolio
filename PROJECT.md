# Project Charter

## Product vision

Build a personal portfolio that feels premium, trustworthy, and fast. The app should scale from a minimal single-page presence to a multi-page showcase with case studies, writing, and interactive experiences.

## UX principles

- Performance first: perceived speed is part of brand quality.
- Accessible by default: semantic HTML, keyboard support, and sufficient contrast are baseline requirements.
- Motion with intent: animation should clarify hierarchy and state changes, never distract.
- Progressive enhancement: core content must remain usable with reduced motion and constrained networks.

## Performance budget

- LCP target: under 2.0s on modern mid-tier mobile.
- CLS target: under 0.1.
- JavaScript budget mindset: keep route-level JS lean, avoid large client bundles without clear ROI.
- Image strategy: optimize all non-decorative media before merging.

## Definition of done

For every feature branch:

- [ ] Clear user-facing objective is documented in PR.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build` all pass.
- [ ] Accessibility basics are validated (semantic structure, keyboard flow, focus states).
- [ ] Mobile and desktop layouts are verified.
- [ ] Any architectural change includes ADR update when appropriate.
- [ ] Docs are updated when new conventions are introduced.

## Future 3D/animation placeholder

When introducing advanced motion or 3D:

- Gate behind performance checks and reduced-motion fallbacks.
- Keep 3D modules isolated in dedicated feature boundaries.
- Avoid introducing global render loops without measurable UX value.

## Anti-patterns (do not do)

- Do not bypass lint/type/test gates to merge quickly.
- Do not put feature-specific logic in `src/components/ui`.
- Do not add dependencies without documenting reason and alternatives.
- Do not introduce client components unless interactivity requires it.
- Do not hardcode content into deeply nested components; centralize in `src/content` when content grows.
