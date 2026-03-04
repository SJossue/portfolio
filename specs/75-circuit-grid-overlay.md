# Visual: Animated circuit board pattern on wall texture

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Add a subtle animated CSS circuit-board pattern overlay to the scanline div in `HomeScene.tsx` to add cyberpunk atmosphere.

### Files to modify (ONLY these files):

1. `src/styles/globals.css`

### Instructions

Add the following CSS at the END of `src/styles/globals.css`, after the `.scanline-overlay` rule:

```css
/* Circuit board grid pattern */
.circuit-grid {
  background-image:
    linear-gradient(rgba(0, 240, 255, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Subtle vignette overlay */
.vignette {
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.4) 100%);
}
```

Do NOT change any existing CSS rules. Only append to the end of the file.

### Acceptance Criteria

- `.circuit-grid` class creates a subtle grid pattern with cyan lines
- `.vignette` class creates a darkening effect at screen edges
- Both classes are purely additive and don't break existing styles
- `npm run validate` passes
