# Feature: Focus Trap in Overlay Panel

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

The overlay panel is a modal dialog but focus can escape to the background via Tab. Implement a simple focus trap so Tab cycles only through focusable elements inside the panel.

### Files to modify (ONLY these files):

1. `src/components/features/scene/OverlayPanel.tsx` — add focus trap logic

### Instructions:

In `OverlayPanel.tsx`, add a new `useEffect` hook AFTER the existing Escape key handler effect (after line 118). Add this new effect:

```tsx
// Focus trap: keep Tab key cycling within the panel
useEffect(() => {
  const panel = panelRef.current;
  if (!panel) return;

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    const focusable = panel!.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  window.addEventListener('keydown', handleTabKey);
  return () => window.removeEventListener('keydown', handleTabKey);
}, []);
```

Do NOT change anything else in OverlayPanel.tsx.

### Acceptance Criteria

- Tab key cycles focus within the panel only
- Shift+Tab wraps backwards
- Escape still closes the panel
- Existing tests pass unchanged
- `npm run validate` passes
