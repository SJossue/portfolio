import { useSceneState } from './useSceneState';

describe('InteractiveHitbox store integration', () => {
  beforeEach(() => {
    useSceneState.setState({
      introState: 'garage',
      interactionLocked: false,
      selectedSection: null,
      hoveredSection: null,
      bootComplete: true,
      modelsReady: true,
      cameraArrived: false,
    });
  });

  it('setSelectedSection updates store when unlocked', () => {
    useSceneState.getState().setSelectedSection('contact');
    expect(useSceneState.getState().selectedSection).toBe('contact');
  });

  it('setSelectedSection is blocked when interaction is locked', () => {
    useSceneState.setState({ interactionLocked: true });
    useSceneState.getState().setSelectedSection('contact');
    expect(useSceneState.getState().selectedSection).toBeNull();
  });

  it('setSelectedSection can clear back to null', () => {
    useSceneState.getState().setSelectedSection('contact');
    expect(useSceneState.getState().selectedSection).toBe('contact');
    useSceneState.getState().setSelectedSection(null);
    expect(useSceneState.getState().selectedSection).toBeNull();
  });

  it('setHoveredSection updates store when unlocked', () => {
    useSceneState.getState().setHoveredSection('projects');
    expect(useSceneState.getState().hoveredSection).toBe('projects');
  });

  it('setHoveredSection is blocked when interaction is locked', () => {
    useSceneState.setState({ interactionLocked: true });
    useSceneState.getState().setHoveredSection('projects');
    expect(useSceneState.getState().hoveredSection).toBeNull();
  });

  it('setHoveredSection can clear back to null', () => {
    useSceneState.getState().setHoveredSection('projects');
    expect(useSceneState.getState().hoveredSection).toBe('projects');
    useSceneState.getState().setHoveredSection(null);
    expect(useSceneState.getState().hoveredSection).toBeNull();
  });
});
