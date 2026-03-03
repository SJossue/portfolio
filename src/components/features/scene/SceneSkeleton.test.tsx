import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SceneSkeleton } from './SceneSkeleton';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div>OrbitControls</div>,
}));

vi.mock('./CameraRig', () => ({
  CameraRig: () => null,
}));

vi.mock('./CarRig', () => ({
  CarRig: () => <div>CarRig</div>,
}));

vi.mock('./GarageInteractables', () => ({
  GarageInteractables: () => null,
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { introState: string }) => string) =>
    selector({ introState: 'idle' }),
}));

describe('SceneSkeleton', () => {
  it('renders canvas when WebGL 2 is available', () => {
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'canvas') {
        (el as HTMLCanvasElement).getContext = vi.fn().mockReturnValue({});
      }
      return el;
    });

    render(<SceneSkeleton />);
    expect(screen.getByTestId('canvas')).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('renders fallback when WebGL 2 is unavailable', () => {
    render(<SceneSkeleton />);
    expect(screen.getByTestId('webgl-fallback')).toBeInTheDocument();
    expect(screen.getByText(/webgl 2/i)).toBeInTheDocument();
  });
});
