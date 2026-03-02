# Description

<!-- Provide a concise summary of what this PR does and why -->

## Related Issue/Spec

<!-- Link to GitHub issue or spec file -->

- Closes #XXX
- Spec: [specs/feature-name.md](../specs/feature-name.md)

## Risk Level

<!-- Select one and delete the others -->

- 🟢 **Low**: Docs, tests, minor UI tweaks, non-breaking refactors
- 🟡 **Medium**: New features, dependency updates, moderate refactors
- 🔴 **High**: Architecture changes, breaking changes, performance-critical code

## Changes

<!-- List key changes made -->

- Added/Updated/Fixed X
- Refactored Y
- Removed Z

## Screenshots/Videos

<!-- If UI changed, provide before/after screenshots or video -->
<!-- Delete this section if not applicable -->

**Before**:

**After**:

## Performance Impact

<!-- Answer these questions -->

- **Bundle size change**: +X KB / -X KB / No change
- **Asset additions**: Images/fonts/models added (sizes)
- **Runtime impact**: 60fps maintained? LCP/CLS affected?
- **Lighthouse score**: (if tested locally or in preview)

## Accessibility Checklist

<!-- Check all that apply, delete if not applicable -->

- [ ] Keyboard navigation works (Tab, Enter, Escape, Arrows)
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Semantic HTML used
- [ ] ARIA labels added where needed
- [ ] Screen reader tested (NVDA/VoiceOver)
- [ ] Respects `prefers-reduced-motion`

## Testing

<!-- What testing was done? -->

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] E2E tests added/updated (Playwright)
- [ ] Manual testing completed
- [ ] Tested on mobile/tablet/desktop
- [ ] Tested in Chrome, Firefox, Safari

## CI Status

<!-- These should pass before merging -->

- [ ] Lint (`npm run lint`)
- [ ] Typecheck (`npm run typecheck`)
- [ ] Unit tests (`npm run test`)
- [ ] Build (`npm run build`)
- [ ] E2E tests (`npm run e2e`) - if applicable

## Preview Link

<!-- Vercel will auto-comment, but you can add manual link here -->

- Preview deployment: [Vercel preview URL]

## Checklist

- [ ] Code follows [CLAUDE.md](../CLAUDE.md) and [docs/AGENTS.md](../docs/AGENTS.md) guidelines
- [ ] Respects architecture from [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md)
- [ ] Performance budgets from [docs/PROJECT.md](../docs/PROJECT.md) respected
- [ ] New dependencies justified (or ADR added)
- [ ] Imports sorted, path aliases used
- [ ] No dead code, commented-out blocks, or unnecessary refactors
- [ ] Commits follow [Conventional Commits](https://www.conventionalcommits.org/)
- [ ] ADR added/updated if architectural decision made (in `docs/adr/`)

## Notes for Reviewers

<!-- Anything specific reviewers should focus on? -->
<!-- Optional: delete if not needed -->

---

**Merge Strategy**: Squash and merge (default) | Rebase | Merge commit (justify)
