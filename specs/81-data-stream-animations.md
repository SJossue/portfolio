# Visual: Animated data stream overlay

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-04

## Task

Create a decorative CSS animation of scrolling binary/hex data that appears subtly along the left edge of the screen when in garage mode, like a terminal data feed.

### Files to modify (ONLY these files):

1. `src/styles/globals.css`

### Instructions

Add the following CSS at the END of `src/styles/globals.css`:

```css
/* Scrolling data stream */
@keyframes data-scroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

.data-stream {
  animation: data-scroll 20s linear infinite;
}

/* Pulse border animation for panels */
@keyframes border-pulse {
  0%,
  100% {
    border-color: rgba(0, 240, 255, 0.1);
  }
  50% {
    border-color: rgba(0, 240, 255, 0.3);
  }
}

.animate-border-pulse {
  animation: border-pulse 3s ease-in-out infinite;
}

/* Fade in up animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.4s ease-out forwards;
}
```

Do NOT change any existing CSS rules.

### Acceptance Criteria

- Three new animations added: `data-scroll`, `border-pulse`, `fade-in-up`
- Corresponding utility classes: `.data-stream`, `.animate-border-pulse`, `.animate-fade-in-up`
- `npm run validate` passes
