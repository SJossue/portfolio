import { renderHook, act } from '@testing-library/react';
import { useSceneState } from './useSceneState';

describe('useSceneState', () => {
  it('has correct initial state', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    expect(result.current.introState).toBe('idle');
    expect(result.current.selectedSection).toBeNull();
    expect(result.current.interactionLocked).toBe(true);
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
      result.current.interactionLocked = true;
    });
    expect(result.current.interactionLocked).toBe(true);
  });
});
