# Feature: Custom Scrollbar in Overlay Panel

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

The overlay panel scrollable area uses the browser default scrollbar which clashes with the cyberpunk dark theme. Add utility classes for a slim, themed scrollbar.

### Files to modify (ONLY these files):

1. `src/styles/globals.css` — add custom scrollbar styles

### Instructions:

At the end of `src/styles/globals.css`, add the following CSS:

```css
/* Cyberpunk thin scrollbar */
.scrollbar-cyber::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-cyber::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-cyber::-webkit-scrollbar-thumb {
  background: rgba(0, 240, 255, 0.2);
  border-radius: 2px;
}

.scrollbar-cyber::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 240, 255, 0.4);
}

.scrollbar-cyber {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 240, 255, 0.2) transparent;
}
```

2. `src/components/features/scene/OverlayPanel.tsx` — apply the scrollbar class

In `OverlayPanel.tsx`, find this line:

```tsx
<div className="flex-1 overflow-y-auto">{SECTION_PANELS[section] ?? null}</div>
```

Replace it with:

```tsx
<div className="scrollbar-cyber flex-1 overflow-y-auto">{SECTION_PANELS[section] ?? null}</div>
```

Do NOT change anything else.

### Acceptance Criteria

- `globals.css` has custom scrollbar styles using the `.scrollbar-cyber` class
- `OverlayPanel.tsx` scroll area has the `scrollbar-cyber` class
- Scrollbar appears thin and cyan-tinted in dark theme
- `npm run validate` passes
