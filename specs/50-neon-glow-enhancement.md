# Feature: NeonTube Glow Enhancement

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Enhance NeonTube with an outer glow cylinder and increased default intensity.

### Files to modify (ONLY these files):

1. `src/components/features/scene/NeonTube.tsx`

### Instructions

**Modify NeonTube.tsx**:

- Change default `intensity` from `2` to `3`
- Add a second mesh (outer glow cylinder) with:
  - Slightly larger radius (0.06 vs 0.03)
  - Same length
  - Same color but `emissiveIntensity` at `intensity * 0.4`
  - `transparent: true`, `opacity: 0.15`
  - `toneMapped: false`

Do NOT change the interface or other defaults.

### Acceptance Criteria

- Default intensity is 3
- Outer glow cylinder renders with transparent material
- Existing tests still pass
- `npm run validate` passes
