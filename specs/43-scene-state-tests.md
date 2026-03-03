# Feature: useSceneState Tests

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add unit tests for the Zustand store `useSceneState` to ensure state transitions work correctly.

### Files to create:

1. `src/components/features/scene/useSceneState.test.ts` — NEW file

### Context

The `useSceneState` store is defined in `src/components/features/scene/useSceneState.ts` with this shape:

```ts
interface SceneState {
  introState: 'idle' | 'airingOut' | 'revealing' | 'garage';
  selectedSection: string | null;
  interactionLocked: boolean;
  setIntroState: (state: SceneState['introState']) => void;
  setSelectedSection: (section: string | null) => void;
  setInteractionLocked: (locked: boolean) => void;
}
```

### Complete file to create

Create `src/components/features/scene/useSceneState.test.ts` with this EXACT content:

```ts
import { renderHook, act } from '@testing-library/react';
import { useSceneState } from './useSceneState';

describe('useSceneState', () => {
  it('has correct initial state', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    expect(result.current.introState).toBe('idle');
    expect(result.current.selectedSection).toBeNull();
    expect(result.current.interactionLocked).toBe(false);
  });

  it('updates introState', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => {
      result.current.setIntroState('garage');
    });
    expect(result.current.introState).toBe('garage');
  });

  it('updates selectedSection', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => {
      result.current.setSelectedSection('projects');
    });
    expect(result.current.selectedSection).toBe('projects');
  });

  it('clears selectedSection', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => {
      result.current.setSelectedSection('projects');
    });
    act(() => {
      result.current.setSelectedSection(null);
    });
    expect(result.current.selectedSection).toBeNull();
  });

  it('updates interactionLocked', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => {
      result.current.setInteractionLocked(true);
    });
    expect(result.current.interactionLocked).toBe(true);
  });
});
```

Do NOT modify any existing files.

### Acceptance Criteria

- New test file at `src/components/features/scene/useSceneState.test.ts`
- 5 tests covering all state transitions
- All tests pass
- `npm run validate` passes
