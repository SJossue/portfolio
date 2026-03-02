# Feature: Install GSAP + ADR

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Install GSAP as a production dependency and document the decision in an ADR. No code changes beyond the install and documentation.

**User story**: As a developer, I want GSAP available in the project so that future specs can use it for deterministic animation timelines.

## Context

`docs/PROJECT.md` lists GSAP as part of the required stack for animation orchestration. It is not yet installed. Per `docs/AGENTS.md`, new dependencies require an ADR.

## Requirements

### Functional Requirements

1. The system MUST install `gsap` as a production dependency via `npm install gsap`
2. The system MUST create `docs/adr/0002-gsap-animation.md` documenting the decision
3. The system MUST add an entry to `docs/ADRS.md` for the new ADR
4. The system MUST NOT add any code that imports or uses GSAP (that is for future specs)

### Non-Functional Requirements

- **Performance**: GSAP core is ~28 KB gzipped. Well within the 200 KB initial JS budget.
- **Bundle size**: Tree-shakeable. Only imported modules are bundled.

## Design

### Technical Approach

**Files to modify/create (ONLY these files):**

1. `package.json` — via `npm install gsap` (do not hand-edit)
2. `package-lock.json` — auto-updated by npm install
3. `docs/adr/0002-gsap-animation.md` — new file
4. `docs/ADRS.md` — append entry

**Run this command:**

```bash
npm install gsap
```

**Create `docs/adr/0002-gsap-animation.md` with this exact content:**

```markdown
# ADR 0002: GSAP for Animation Orchestration

**Status**: Accepted
**Date**: 2026-03-02
**Deciders**: Project owner

## Context

The portfolio requires deterministic, timeline-based animations for:

- Car suspension "air-out" sequence
- Camera transitions between intro shots
- Garage environment reveal
- Interactive object hover/click feedback

We need a library that integrates well with React Three Fiber (R3F) and provides timeline sequencing.

## Decision

Use **GSAP** (GreenSock Animation Platform) for all animation orchestration in the 3D scene.

## Rationale

- **Deterministic timelines**: GSAP timelines provide precise sequencing with callbacks, which is critical for the intro cinematic (air-out -> camera reveal -> garage visible).
- **R3F integration**: GSAP can animate any JavaScript object property, including Three.js object transforms accessed via React refs.
- **Performance**: GSAP uses requestAnimationFrame internally and is highly optimized. Core is ~28 KB gzipped.
- **Tree-shakeable**: Only imported modules are bundled.
- **Industry standard**: Widely used, well-documented, stable API.

### Alternatives Considered

| Alternative                    | Why Not                                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| `useFrame` + lerp (native R3F) | Works for simple animations but lacks timeline sequencing, callbacks, and easing control needed for the cinematic intro        |
| Framer Motion                  | PROJECT.md explicitly forbids Framer Motion for 3D use; it adds significant bundle weight and does not integrate well with R3F |
| `@react-spring/three`          | Good for physics-based animations but not ideal for deterministic timelines with precise sequencing                            |

## Consequences

- GSAP is added as a production dependency (~28 KB gzipped)
- Animation code will use `gsap.timeline()` and `gsap.to()` for scene transitions
- GSAP timelines should be created in `useEffect` or `useLayoutEffect` and cleaned up on unmount via `timeline.kill()`
```

**Append to `docs/ADRS.md`:**

Add this line after the existing ADR 0001 entry:

```markdown
| [ADR-0002](adr/0002-gsap-animation.md) | GSAP for animation orchestration | Accepted |
```

## Acceptance Criteria

- [ ] `gsap` appears in `dependencies` in `package.json` (NOT devDependencies)
- [ ] `docs/adr/0002-gsap-animation.md` exists with status "Accepted"
- [ ] `docs/ADRS.md` includes an entry for ADR-0002
- [ ] No source files import or use GSAP
- [ ] `npm run validate` passes (lint, typecheck, test, build, e2e)

## Testing Strategy

- **Unit tests**: None needed (no code changes)
- **E2E tests**: None needed (no behavior changes)
- **Manual verification**: `npm ls gsap` shows the package installed

## Performance Budgets

- **Bundle size impact**: 0 KB (GSAP installed but not imported — tree-shaken away)
- **Future impact**: ~28 KB gzipped when first imported

## Dependencies

- New: `gsap` (production dependency)
- Justification: Required by PROJECT.md, documented in ADR-0002

## Risks & Mitigations

| Risk                | Impact | Likelihood | Mitigation                         |
| ------------------- | ------ | ---------- | ---------------------------------- |
| Bundle size concern | Low    | Low        | GSAP core is 28 KB, tree-shakeable |

## Out of Scope

- Writing any animation code
- Importing GSAP in any component
- GSAP plugins (ScrollTrigger, etc.)

## References

- PROJECT.md required stack
- GSAP docs: https://gsap.com/docs/v3/

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
