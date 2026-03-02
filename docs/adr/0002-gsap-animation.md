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
