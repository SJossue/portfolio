# Feature: 3D Floating Labels Above Interactables

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

---

## Overview

Add floating text labels above each 3D interactable object so visitors know what each object represents before clicking. Labels use drei's `<Html>` component for crisp DOM text that billboards toward the camera.

**User story**: As a visitor, I want to see labels above the 3D objects in the garage so I know which one to click for projects, contact, or about.

## Requirements

### Functional Requirements

1. Each interactable MUST display a floating label above it showing its `label` text.
2. Labels MUST always face the camera (billboard behavior via drei `<Html>`).
3. Labels MUST have cyberpunk styling (neon glow text, translucent background).
4. Labels SHOULD subtly pulse or glow brighter when the parent interactable is hovered.
5. Labels MUST use `occlude` so they hide behind walls/objects.

### Non-Functional Requirements

- **Performance**: `<Html>` renders DOM elements — keep them lightweight (no complex CSS).
- **Accessibility**: Labels are decorative (3D context); the HUD bar provides the accessible navigation.

## Technical Approach

### Modified Files

| File               | Change                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| `Interactable.tsx` | Add `<Html>` label above the Box, pass `hovered` state for glow effect |

### Implementation

Inside `Interactable.tsx`, after the children group, add:

```tsx
<Html position={[0, 1.4, 0]} center distanceFactor={8} occlude style={{ pointerEvents: 'none' }}>
  <div
    className={`whitespace-nowrap rounded-sm px-2 py-0.5 font-mono text-xs tracking-wider transition-all duration-300 ${hovered ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_8px_rgba(0,240,255,0.4)]' : 'bg-black/40 text-white/60'}`}
  >
    {label}
  </div>
</Html>
```

### Mock for Tests

Add `Html: (props: Record<string, unknown>) => <div data-testid="html-label">{props.children}</div>` to drei mock in test files.

## Acceptance Criteria

- [ ] Labels visible above all 3 interactables in garage state
- [ ] Labels face camera at all angles
- [ ] Labels glow brighter on hover
- [ ] Labels hidden behind walls (occlude)
- [ ] `npm run validate` passes
- [ ] No new dependencies

## Testing Strategy

- **Unit tests**: Update Interactable.test.tsx drei mock to include Html, verify label renders
- **Manual**: Visual check that labels billboard and occlude correctly

## Out of Scope

- Animated label entrance
- Custom fonts for labels
- Label icons
