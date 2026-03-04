# Visual: Enhanced garage materials with texture variation

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Add more material presets to `garage-materials.ts` for visual variety — worn rubber, glass, chrome, and emissive screen materials.

### Files to modify (ONLY these files):

1. `src/components/features/scene/garage-materials.ts`

### Instructions

Add the following material presets at the END of `src/components/features/scene/garage-materials.ts`, after the existing `FLOOR_STAIN` export:

```typescript
export const WORN_RUBBER = {
  color: '#0d0d0d',
  metalness: 0.0,
  roughness: 0.95,
} as const;

export const CHROME = {
  color: '#cccccc',
  metalness: 0.95,
  roughness: 0.1,
} as const;

export const FROSTED_GLASS = {
  color: '#1a2a3a',
  metalness: 0.1,
  roughness: 0.3,
  transparent: true,
  opacity: 0.6,
} as const;

export const SCREEN_GLOW = {
  emissive: '#003344',
  emissiveIntensity: 1.5,
  color: '#001122',
  toneMapped: false,
} as const;

export const HAZARD_YELLOW = {
  color: '#cc8800',
  metalness: 0.2,
  roughness: 0.7,
} as const;

export const CONCRETE_LIGHT = {
  color: '#1a1a1a',
  metalness: 0.05,
  roughness: 0.95,
} as const;
```

Do NOT modify any existing material definitions.

### Acceptance Criteria

- 6 new material presets added: `WORN_RUBBER`, `CHROME`, `FROSTED_GLASS`, `SCREEN_GLOW`, `HAZARD_YELLOW`, `CONCRETE_LIGHT`
- Existing materials are untouched
- `npm run validate` passes
