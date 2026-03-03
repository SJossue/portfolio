# Feature: Skip Intro Persistence + Escape Key

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Add Escape key support to skip the intro from any pre-garage state, and persist the skip preference in localStorage so returning visitors go straight to the garage.

**User story**: As a returning visitor, I want the site to remember that I've already seen the intro so I don't have to skip it every time.

## Context

PROJECT.md lists two UX non-negotiables that are not yet implemented:

1. "Intro must be skippable (keyboard Escape, localStorage preference)"
2. Skip preference must persist across sessions

Currently, skipping only works via the "Skip Intro" button click. No Escape key handler exists. No localStorage persistence exists.

## Requirements

### Functional Requirements

1. The system MUST listen for `keydown` events on `Escape` while `introState` is `'idle'`, `'airingOut'`, or `'revealing'`
2. When Escape is pressed during those states, the system MUST set `introState` to `'garage'`
3. When the intro is skipped (by any method: button, Escape, or reduced-motion), the system MUST store `'true'` in `localStorage` under the key `'portfolio-skip-intro'`
4. On mount, the system MUST check `localStorage` for `'portfolio-skip-intro'` and if `'true'`, set `introState` to `'garage'` immediately
5. The localStorage check MUST run before the `prefers-reduced-motion` check (both result in the same state, but localStorage should take priority to avoid the reduced-motion flash)
6. The system MUST add an E2E test for Escape key skipping

### Non-Functional Requirements

- **Performance**: No impact (single event listener)
- **Accessibility**: Escape key is a standard dismissal pattern (WCAG)
- **Browser Support**: localStorage available in all target browsers

## Design

### Technical Approach

**Files to modify (ONLY these files):**

1. `src/components/features/scene/HomeScene.tsx` — add Escape handler + localStorage read/write
2. `e2e/home.spec.ts` — add Escape key test

**Do NOT modify `useSceneState.ts`.** The localStorage logic belongs in the component layer (HomeScene), not the store. The store remains a pure state container.

**Modify `HomeScene.tsx`:**

Add a new `useEffect` for localStorage check on mount (before reduced-motion check):

```tsx
// Check localStorage for skip preference on mount
useEffect(() => {
  try {
    if (localStorage.getItem('portfolio-skip-intro') === 'true') {
      setIntroState('garage');
    }
  } catch {
    // localStorage unavailable (SSR, privacy mode) — ignore
  }
}, [setIntroState]);
```

Add a new `useEffect` for Escape key handling:

```tsx
// Escape key skips intro from any pre-garage state
useEffect(() => {
  if (introState === 'garage') return;

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      setIntroState('garage');
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [introState, setIntroState]);
```

Add a new `useEffect` to persist skip preference when entering garage state:

```tsx
// Persist skip preference when garage state is reached
useEffect(() => {
  if (introState === 'garage') {
    try {
      localStorage.setItem('portfolio-skip-intro', 'true');
    } catch {
      // localStorage unavailable — ignore
    }
  }
}, [introState]);
```

The full order of effects in HomeScene should be:

1. localStorage check (skip if returning visitor)
2. `prefers-reduced-motion` check (skip if accessibility preference)
3. Escape key listener (active until garage)
4. localStorage write (persist on garage entry)

**Add to `e2e/home.spec.ts`:**

```typescript
test('escape key skips intro', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('button', { name: /air out/i })).toBeVisible();

  await page.keyboard.press('Escape');

  await expect(page.getByTestId('garage-shell')).toBeVisible();
});
```

## Acceptance Criteria

- [ ] Pressing Escape during `idle` state skips to `garage`
- [ ] Pressing Escape during `airingOut` state skips to `garage`
- [ ] Pressing Escape during `revealing` state skips to `garage`
- [ ] Pressing Escape during `garage` state does nothing (no error)
- [ ] After reaching `garage` state, `localStorage.getItem('portfolio-skip-intro')` returns `'true'`
- [ ] On fresh page load with `portfolio-skip-intro` set to `'true'` in localStorage, the scene starts in `garage` state (no intro buttons shown)
- [ ] E2E test for Escape key passes
- [ ] All existing E2E tests still pass
- [ ] `npm run validate` passes

## Testing Strategy

- **Unit tests**: No new unit tests needed (effect logic is thin, tested via E2E)
- **E2E tests**: New test for Escape key. Existing skip-intro test covers button path.
- **Manual**: Verify localStorage persists across page reloads

## Performance Budgets

- **Bundle size impact**: ~0 bytes (standard DOM APIs)

## Accessibility Checklist

- [x] Escape key is standard dismissal pattern (WCAG 2.1 SC 2.1.1)
- [x] No focus trap introduced
- [x] Screen reader users can still use Skip Intro button

## Dependencies

- None. No new packages.

## Risks & Mitigations

| Risk                                     | Impact | Likelihood | Mitigation                                       |
| ---------------------------------------- | ------ | ---------- | ------------------------------------------------ |
| localStorage unavailable in privacy mode | Low    | Low        | try/catch wrapper, falls back to normal intro    |
| E2E test for localStorage persistence    | Low    | Low        | Out of scope — would require page reload in test |

## Out of Scope

- Manual toggle UI for reduced-motion preference
- Reset/clear skip preference UI
- `prefers-reduced-motion` manual toggle (separate spec)

## References

- PROJECT.md UX non-negotiable #1

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
