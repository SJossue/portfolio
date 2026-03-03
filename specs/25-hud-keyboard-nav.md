# Feature: HUD Keyboard Navigation

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add keyboard navigation to the HUD bar buttons. Arrow keys cycle between buttons, Enter/Space activates.

### Files to modify (ONLY these files):

1. `src/components/features/scene/HomeScene.tsx` — add keyboard handler to HUD bar

### Instructions:

In the HUD bar `<div>` (the one with `data-testid="garage-shell"`), add an `onKeyDown` handler and `role="toolbar"`:

Find the HUD bar div and update it. Change:

```tsx
<div
  className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 border-t border-cyan-400/10 bg-black/70 p-4 backdrop-blur-md"
  data-testid="garage-shell"
>
```

To:

```tsx
<div
  className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-4 border-t border-cyan-400/10 bg-black/70 p-4 backdrop-blur-md"
  data-testid="garage-shell"
  role="toolbar"
  aria-label="Navigation"
  onKeyDown={(e) => {
    const buttons = e.currentTarget.querySelectorAll('button');
    const current = Array.from(buttons).indexOf(e.target as HTMLButtonElement);
    if (current === -1) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      buttons[(current + 1) % buttons.length]?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      buttons[(current - 1 + buttons.length) % buttons.length]?.focus();
    }
  }}
>
```

Do NOT change anything else in HomeScene.tsx.

### Acceptance Criteria

- HUD bar has `role="toolbar"` and `aria-label="Navigation"`
- Arrow keys cycle focus between HUD buttons
- Existing click and keyboard behavior unchanged
- `npm run validate` passes
