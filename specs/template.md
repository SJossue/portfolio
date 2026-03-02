# Feature: [Feature Name]

**Status**: `draft` | `approved` | `implemented` | `deprecated`
**Owner**: [Your name or "Agent"]
**Created**: YYYY-MM-DD
**Last Updated**: YYYY-MM-DD

---

## Overview

A brief (2-3 sentences) description of what this feature does and why it exists.

**User story**: As a [user type], I want [goal] so that [benefit].

## Context

Why are we building this? What problem does it solve? Link to any relevant ADRs, GitHub issues, or design files.

## Requirements

### Functional Requirements

1. The system MUST...
2. The system SHOULD...
3. The system MAY...

### Non-Functional Requirements

- **Performance**: Specific budgets (e.g., "3D model must load in < 2s on 3G")
- **Accessibility**: WCAG level, keyboard support, screen reader behavior
- **Browser Support**: Minimum versions, fallback behavior
- **Mobile**: Responsive breakpoints, touch interactions

## Design

### User Interface

- Describe layout, visual hierarchy, spacing
- Link to Figma/mockups if available
- Note any design system components used

### User Experience

- Interaction flow (step-by-step)
- Expected user feedback (loading states, errors, success)
- Edge cases (empty states, errors, offline)

### Technical Approach

- High-level architecture (components, state management, data flow)
- Key dependencies (libraries, APIs)
- File structure (where new code goes)

## Acceptance Criteria

Checklist of specific, testable conditions that MUST be met:

- [ ] User can [specific action]
- [ ] When [condition], then [expected behavior]
- [ ] Component renders [expected output] given [input]
- [ ] Performance: [metric] is under [budget]
- [ ] Accessibility: [specific requirement] is met
- [ ] Tests: [coverage requirement] for [component/feature]

## Testing Strategy

- **Unit tests**: What logic needs isolated tests?
- **Integration tests**: What interactions need testing?
- **E2E tests**: What user flows need Playwright coverage?
- **Manual tests**: What requires human verification (visual, UX)?

## Performance Budgets

Specific constraints from [PROJECT.md](../docs/PROJECT.md):

- **Bundle size impact**: +X KB (must stay under Y KB total)
- **Asset size**: Images/models/fonts must be under Z KB
- **Runtime performance**: Maintain 60fps, LCP under 2.5s, etc.

## Accessibility Checklist

- [ ] Semantic HTML used
- [ ] Keyboard navigation supported (Tab, Enter, Escape, Arrow keys)
- [ ] Focus indicators visible
- [ ] ARIA labels where needed
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Respects `prefers-reduced-motion`
- [ ] Screen reader tested (NVDA/VoiceOver)

## Dependencies

- New npm packages (justify each, note bundle impact)
- External APIs or services
- Requires ADR if adding significant dependencies

## Risks & Mitigations

| Risk                             | Impact | Likelihood | Mitigation                              |
| -------------------------------- | ------ | ---------- | --------------------------------------- |
| Performance regression on mobile | High   | Medium     | Test on real devices, use Lighthouse CI |
| Browser compatibility issue      | Medium | Low        | Feature detection + fallback            |

## Open Questions

- [ ] Question 1? (Assign to: X, Due: YYYY-MM-DD)
- [ ] Question 2?

## Out of Scope

Explicitly list what this spec does NOT include (to prevent scope creep):

- Future iteration X
- Related feature Y (tracked in Issue #Z)

## References

- GitHub Issue: #XXX
- ADR: [ADR-XXXX](../docs/adr/XXXX-description.md)
- Design: [Figma link]
- Related specs: [Other spec files]

---

## Implementation Notes

_Add notes during implementation here (agent or human):_

- YYYY-MM-DD: Discovered X, adjusted approach to Y (reason: Z)
- YYYY-MM-DD: Acceptance criteria updated (original was ambiguous)

## Sign-off

- [ ] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged: #XXX
