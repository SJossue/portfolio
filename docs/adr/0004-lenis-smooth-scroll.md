# ADR 0004: Lenis for Smooth Scroll

**Status**: Accepted
**Date**: 2026-03-24
**Deciders**: Project owner

## Context

The scroll portfolio needs a polished, premium scroll feel to match the craft of the 3D scene. Native browser scrolling varies significantly across devices (mouse wheel vs trackpad vs touch) and lacks the smoothness expected in a portfolio showcasing technical skill.

## Decision

Use **Lenis** for smooth scroll normalization on the scroll portfolio experience.

## Rationale

- **Tiny footprint**: ~3 KB gzipped — negligible impact on the 200 KB initial JS budget
- **GSAP integration**: Official ScrollTrigger bridge via `lenis.on('scroll', ScrollTrigger.update)` — works seamlessly with existing GSAP animation system (ADR 0002)
- **Cross-device normalization**: Smooths mouse wheel, trackpad, and touch scroll uniformly
- **Respects accessibility**: Can be disabled when `prefers-reduced-motion: reduce` is active
- **Minimal API surface**: Single instantiation, no global side effects, clean unmount

### Alternatives Considered

| Alternative                      | Why Not                                                                       |
| -------------------------------- | ----------------------------------------------------------------------------- |
| Native `scroll-behavior: smooth` | Only affects programmatic scrolls (anchor clicks), not the scroll feel itself |
| Locomotive Scroll                | Much heavier (~15 KB), more opinionated, overlaps with GSAP ScrollTrigger     |
| Custom RAF scroll                | Significant engineering effort for marginal benefit over Lenis                |

## Consequences

- `lenis` added as a production dependency (~3 KB gzipped)
- Lenis instance created once in `ScrollPortfolio` via `useSmoothScroll` hook
- Must be disabled/bypassed when in 3D mode (viewport is locked anyway)
- Must respect `prefers-reduced-motion` preference
