# Visual: HUD scan-line divider between sections

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Add a decorative animated scan-line divider between the 3D scene and the HUD bar for a cleaner separation and cyberpunk feel.

### Files to modify (ONLY these files):

1. `src/styles/globals.css`

### Instructions

Add the following CSS at the END of `src/styles/globals.css`:

```css
/* Animated scan-line divider */
@keyframes scan-sweep {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.scan-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 240, 255, 0.4) 50%, transparent 100%);
  background-size: 200% 100%;
  animation: scan-sweep 3s linear infinite;
}

/* Noise grain overlay */
.noise-grain {
  pointer-events: none;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

Do NOT change any existing CSS rules.

### Acceptance Criteria

- `.scan-divider` creates an animated cyan sweep line
- `.noise-grain` creates a subtle film grain overlay using SVG filter
- Both classes are additive and don't break existing styles
- `npm run validate` passes
