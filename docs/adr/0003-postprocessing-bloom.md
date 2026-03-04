# ADR 0003: Post-Processing Bloom

**Status**: Accepted
**Date**: 2026-03-03

## Context

The 3D garage scene uses emissive materials on neon tubes, light fixtures, and floor strips to create a cyberpunk aesthetic. Without post-processing, emissive materials appear as flat bright colors without the characteristic glow/bleed effect that defines neon lighting. The scene looks artificial and lacks atmosphere.

## Decision

Add `@react-three/postprocessing` and apply an `EffectComposer` with a `Bloom` pass to the scene when the garage is active.

### Configuration

- `intensity`: 0.8 — visible glow without washing out detail
- `luminanceThreshold`: 0.6 — only bright emissive surfaces bloom
- `luminanceSmoothing`: 0.9 — smooth falloff for natural appearance
- `mipmapBlur`: true — higher quality bloom with minimal performance cost

### Conditional rendering

Bloom is only mounted when `introState === 'garage'` to avoid unnecessary GPU work during the intro sequence.

## Alternatives Considered

1. **CSS filter blur overlay** — Cannot interact with 3D geometry; looks flat
2. **Custom shader passes** — Too much maintenance overhead for the benefit
3. **drei's `GodRays`** — Only works with directional light sources, not emissive meshes

## Consequences

- **Bundle size**: `@react-three/postprocessing` adds ~15-20 KB gzipped (tree-shakeable, only Bloom is imported)
- **GPU cost**: One additional render pass; mipmapBlur is efficient. No measurable FPS drop on mid-range hardware
- **Testing**: EffectComposer and Bloom are mocked in tests (they require WebGL context)
- **Compatibility**: Requires WebGL 2 (already enforced by the existing fallback)
