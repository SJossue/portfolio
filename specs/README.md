# Feature Specifications

This directory contains deterministic feature specifications that agents (and humans) use to implement work with minimal ambiguity.

## Purpose

Specs serve as:

1. **Contracts for agents**: Clear, actionable implementation instructions
2. **Documentation**: Design decisions and requirements in one place
3. **Review artifacts**: What to validate in PRs
4. **Historical record**: Why features were built a certain way

## When to Create a Spec

Create a spec when:

- Adding a new user-facing feature
- Implementing complex business logic
- Making architectural changes that span multiple files
- Building reusable components with specific behavior
- Adding 3D experiences or animations with performance constraints

**Do NOT create specs for**:

- Trivial bug fixes (unless they require design decisions)
- Dependency updates
- Documentation-only changes
- Formatting/linting fixes

## Workflow

1. **Before implementation**: Create `specs/<feature-name>.md` using [template.md](./template.md)
2. **During implementation**: Reference the spec, update if requirements change
3. **In PR**: Link to the spec, confirm all acceptance criteria met
4. **After merge**: Spec remains as documentation; update if behavior changes

## Naming Convention

Use kebab-case filenames that match the feature or component:

- `user-settings-panel.md`
- `3d-car-viewer.md`
- `skip-intro-toggle.md`
- `reduced-motion-support.md`

## Agent Instructions

When assigned a spec:

1. Read the spec completely before starting
2. Follow the acceptance criteria exactly
3. Respect performance budgets and constraints
4. Add tests as specified
5. Update the spec if you discover missing requirements (note changes in PR)
6. Mark the spec reference in your PR description

## Review Checklist

When reviewing PRs with specs:

- [ ] All acceptance criteria met
- [ ] Performance budgets respected
- [ ] Tests cover specified behavior
- [ ] Accessibility requirements satisfied
- [ ] Spec accurately reflects implementation (or was updated)

---

See [template.md](./template.md) for the spec format.
