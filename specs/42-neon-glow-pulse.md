# Feature: Neon Glow Hover Pulse on Interactable Labels

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add a pulsing neon glow CSS animation class and add a corresponding `shadow-glow` utility class for use on hovered interactable labels.

### Files to modify (ONLY these files):

1. `src/styles/globals.css` — add the neon glow keyframe
2. `tailwind.config.ts` — add the animation and keyframe

### Instructions

**Add to the end of `src/styles/globals.css`** (after the existing `.scanline-overlay` rule):

```css

/* Neon glow pulse */
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 4px rgba(0, 240, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 12px rgba(0, 240, 255, 0.6), 0 0 24px rgba(0, 240, 255, 0.2);
  }
}

.animate-glow-pulse {
  animation: glow-pulse 2s ease-in-out infinite;
}
```

Do NOT change anything else.

### Acceptance Criteria

- `globals.css` has the `glow-pulse` keyframe and `.animate-glow-pulse` class
- `npm run validate` passes
