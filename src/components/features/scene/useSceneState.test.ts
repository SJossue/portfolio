import { renderHook, act } from '@testing-library/react';
import { useSceneState } from './useSceneState';

describe('useSceneState', () => {
  beforeEach(() => {
    useSceneState.setState({
      introState: 'idle',
      interactionLocked: true,
      selectedSection: null,
      hoveredSection: null,
      bootComplete: false,
      modelsReady: false,
      cameraArrived: false,
    });
  });

  it('has correct initial state', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    expect(result.current.introState).toBe('idle');
    expect(result.current.selectedSection).toBeNull();
    expect(result.current.hoveredSection).toBeNull();
    expect(result.current.interactionLocked).toBe(true);
  });

  it('updates introState and unlocks interaction at garage', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => {
      result.current.setIntroState('garage');
    });
    expect(result.current.introState).toBe('garage');
    expect(result.current.interactionLocked).toBe(false);
  });

  it('updates selectedSection when unlocked', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => result.current.setIntroState('garage'));
    act(() => result.current.setSelectedSection('projects'));
    expect(result.current.selectedSection).toBe('projects');
  });

  it('blocks setSelectedSection when locked', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => result.current.setSelectedSection('projects'));
    expect(result.current.selectedSection).toBeNull();
  });

  it('clears selectedSection', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => result.current.setIntroState('garage'));
    act(() => result.current.setSelectedSection('projects'));
    act(() => result.current.setSelectedSection(null));
    expect(result.current.selectedSection).toBeNull();
  });

  it('updates hoveredSection when unlocked', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => result.current.setIntroState('garage'));
    act(() => result.current.setHoveredSection('contact'));
    expect(result.current.hoveredSection).toBe('contact');
  });

  it('blocks setHoveredSection when locked', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => result.current.setHoveredSection('contact'));
    expect(result.current.hoveredSection).toBeNull();
  });

  it('clears hoveredSection regardless of lock', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => result.current.setIntroState('garage'));
    act(() => result.current.setHoveredSection('contact'));
    // Re-lock interaction
    act(() => result.current.setIntroState('idle'));
    // Clearing to null should still work even when locked
    act(() => result.current.setHoveredSection(null));
    expect(result.current.hoveredSection).toBeNull();
  });

  it('setBootComplete sets bootComplete to true', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    expect(result.current.bootComplete).toBe(false);
    act(() => result.current.setBootComplete());
    expect(result.current.bootComplete).toBe(true);
  });

  it('setModelsReady sets modelsReady to true', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    expect(result.current.modelsReady).toBe(false);
    act(() => result.current.setModelsReady());
    expect(result.current.modelsReady).toBe(true);
  });

  it('setCameraArrived updates cameraArrived', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    expect(result.current.cameraArrived).toBe(false);
    act(() => result.current.setCameraArrived(true));
    expect(result.current.cameraArrived).toBe(true);
    act(() => result.current.setCameraArrived(false));
    expect(result.current.cameraArrived).toBe(false);
  });

  it('setSelectedSection resets cameraArrived when selecting a section', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => result.current.setIntroState('garage'));
    act(() => result.current.setCameraArrived(true));
    expect(result.current.cameraArrived).toBe(true);
    act(() => result.current.setSelectedSection('projects'));
    expect(result.current.cameraArrived).toBe(false);
  });

  it('setSelectedSection does not reset cameraArrived when clearing', () => {
    const { result } = renderHook(() => useSceneState((s) => s));
    act(() => result.current.setIntroState('garage'));
    act(() => result.current.setSelectedSection('projects'));
    act(() => result.current.setCameraArrived(true));
    act(() => result.current.setSelectedSection(null));
    expect(result.current.cameraArrived).toBe(true);
  });
});
