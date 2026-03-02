# Feature: Intro State Machine Refactor

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-02
**Last Updated**: 2026-03-02

---

## Overview

Replace the current intro state machine with a deterministic 4-state model that has clear transitions and no dead ends. Add a derived `interactionLocked` flag. Remove the unused `useSceneState` import from `SceneSkeleton.tsx`.

**User story**: As a developer, I want the intro state machine to have deterministic transitions so that animations and UI can reliably react to state changes.

## Context

The current `useSceneState.ts` defines states `idle | animating | skipped | done`. The `animating` state is a dead end — nothing transitions out of it. The new state machine replaces these with `idle | airingOut | revealing | garage`, where every state has a clear exit.

## Requirements

### Functional Requirements

1. The system MUST replace the `IntroState` type with: `'idle' | 'airingOut' | 'revealing' | 'garage'`
2. The system MUST add a derived boolean `interactionLocked` to the store that is `true` when `introState` is `'idle'`, `'airingOut'`, or `'revealing'`
3. The system MUST update `HomeScene.tsx` button handlers: "AIR OUT" sets state to `'airingOut'`, "Skip Intro" sets state to `'garage'`
4. The system MUST update the garage-shell visibility condition from `introState === 'done' || introState === 'skipped'` to `introState === 'garage'`
5. The system MUST update the `prefers-reduced-motion` handler to set state to `'garage'` instead of `'skipped'`
6. The system MUST remove the unused `useSceneState` import from `SceneSkeleton.tsx`
7. The system MUST update existing tests to use the new state names

### Non-Functional Requirements

- **Performance**: No impact (pure type/logic change)
- **Accessibility**: `prefers-reduced-motion` behavior preserved (skips to `'garage'`)
- **Browser Support**: No change
- **Mobile**: No change

## Design

### Technical Approach

**Files to modify (ONLY these files):**

1. `src/components/features/scene/useSceneState.ts` — new types + `interactionLocked`
2. `src/components/features/scene/HomeScene.tsx` — updated state references
3. `src/components/features/scene/SceneSkeleton.tsx` — remove unused import
4. `src/components/features/scene/SceneSkeleton.test.tsx` — update if it references old states
5. `e2e/home.spec.ts` — no changes needed (tests use button text and testids, not state names)

**Exact changes:**

### useSceneState.ts — replace entire file with:

```typescript
import { create } from 'zustand';

type IntroState = 'idle' | 'airingOut' | 'revealing' | 'garage';

interface SceneState {
  introState: IntroState;
  interactionLocked: boolean;
  setIntroState: (state: IntroState) => void;
}

export const useSceneState = create<SceneState>((set) => ({
  introState: 'idle',
  interactionLocked: true,
  setIntroState: (introState) =>
    set({
      introState,
      interactionLocked: introState !== 'garage',
    }),
}));
```

### HomeScene.tsx — changes:

- Line 31: change `setIntroState('animating')` to `setIntroState('airingOut')`
- Line 44: change `setIntroState('skipped')` to `setIntroState('garage')`
- Line 19: change `setIntroState('skipped')` to `setIntroState('garage')`
- Line 53: change `introState === 'done' || introState === 'skipped'` to `introState === 'garage'`

### SceneSkeleton.tsx — changes:

- Remove the line `import { useSceneState } from './useSceneState';` (line 6). This import is unused.

## Acceptance Criteria

- [ ] `IntroState` type is `'idle' | 'airingOut' | 'revealing' | 'garage'` in `useSceneState.ts`
- [ ] `interactionLocked` boolean exists in the store, derived from `introState`
- [ ] `interactionLocked` is `true` for `idle`, `airingOut`, `revealing` and `false` for `garage`
- [ ] "AIR OUT" button sets state to `'airingOut'`
- [ ] "Skip Intro" button sets state to `'garage'`
- [ ] `prefers-reduced-motion` sets state to `'garage'`
- [ ] Garage shell renders when `introState === 'garage'`
- [ ] No unused imports in `SceneSkeleton.tsx`
- [ ] `npm run validate` passes (lint, typecheck, test, build, e2e)

## Testing Strategy

- **Unit tests**: Update `useSceneState` test (if any) to verify new states and `interactionLocked` derivation
- **E2E tests**: Existing e2e tests in `e2e/home.spec.ts` should pass unchanged — they test button text and `data-testid="garage-shell"`, not internal state names

## Performance Budgets

- **Bundle size impact**: ~0 bytes (type rename only)
- **Runtime performance**: No change

## Accessibility Checklist

- [x] `prefers-reduced-motion` still bypasses intro (sets `'garage'`)
- [x] Button labels unchanged
- [x] `aria-label` attributes unchanged

## Dependencies

- None. No new packages.

## Risks & Mitigations

| Risk                            | Impact | Likelihood | Mitigation                                               |
| ------------------------------- | ------ | ---------- | -------------------------------------------------------- |
| Test uses old state name string | Low    | Low        | Search all test files for 'animating', 'skipped', 'done' |

## Out of Scope

- Camera rig implementation
- Animation logic
- GSAP installation
- Any new components

## References

- Current file: `src/components/features/scene/useSceneState.ts`

---

## Implementation Notes

_Agent writes here during execution._

## Sign-off

- [x] Spec reviewed and approved
- [ ] Implementation complete
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] PR merged
