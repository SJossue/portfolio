# Feature: Post-Processing Bloom + Integration

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add bloom post-processing and integrate all new garage sub-components.

### Dependencies to add:

- `@react-three/postprocessing`

### Files to modify:

1. `src/components/features/scene/SceneSkeleton.tsx` — add EffectComposer + Bloom, remove redundant wall lights
2. `src/components/features/scene/SceneSkeleton.test.tsx` — mock postprocessing
3. `src/components/features/scene/GarageEnvironment.tsx` — replace inline geometry with sub-component imports
4. `src/components/features/scene/GarageEnvironment.test.tsx` — mock sub-components
5. `src/components/features/scene/index.ts` — add new exports

### Files to create:

1. `docs/adr/0003-postprocessing-bloom.md`

### Files to update:

1. `docs/ADRS.md` — add ADR 0003 link

### Instructions

**SceneSkeleton.tsx**:

- Import `EffectComposer`, `Bloom` from `@react-three/postprocessing`
- Add `<EffectComposer><Bloom intensity={0.8} luminanceThreshold={0.6} luminanceSmoothing={0.9} mipmapBlur /></EffectComposer>` inside Canvas, conditional on `isGarageReady`
- Remove ceiling fill, left wall cyan, right wall magenta, and back wall glow pointLights (replaced by GarageLightFixtures). Keep workstation and monitor area lights.

**GarageEnvironment.tsx**:

- Remove inline walls, pipes, Sparkles, ContactShadows
- Import and render: `GarageStructure`, `GaragePipes`, `GarageShelving`, `GarageLightFixtures`, `GarageAtmosphere`
- Keep reflective floor and NeonTube placements

**Tests**: Mock `@react-three/postprocessing` and sub-components.

### Acceptance Criteria

- Bloom renders in garage state
- GarageEnvironment delegates to sub-components
- ADR 0003 exists and is linked in ADRS.md
- `npm run validate` passes
