import { useSceneState } from './useSceneState';

describe('SceneHitboxes', () => {
  beforeEach(() => {
    useSceneState.setState({
      introState: 'garage',
      interactionLocked: false,
      selectedSection: null,
      bootComplete: true,
      modelsReady: true,
      cameraArrived: false,
    });
  });

  it('interaction is enabled when introState is garage', () => {
    expect(useSceneState.getState().interactionLocked).toBe(false);
    expect(useSceneState.getState().introState).toBe('garage');
  });

  it('interaction is locked when introState is not garage', () => {
    useSceneState.getState().setIntroState('idle');
    expect(useSceneState.getState().interactionLocked).toBe(true);
  });

  it('each section can be selected when garage is active', () => {
    const sections = ['research', 'projects', 'tools', 'about'];
    for (const section of sections) {
      useSceneState.getState().setSelectedSection(section);
      expect(useSceneState.getState().selectedSection).toBe(section);
    }
  });

  it('sections cannot be selected when not in garage state', () => {
    useSceneState.getState().setIntroState('idle');
    useSceneState.getState().setSelectedSection('research');
    expect(useSceneState.getState().selectedSection).toBeNull();
  });
});
