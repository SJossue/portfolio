import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
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

vi.mock('@react-three/postprocessing', () => ({
  EffectComposer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="effect-composer">{children}</div>
  ),
  Bloom: () => <div data-testid="bloom" />,
}));

vi.mock('./CameraRig', () => ({
  CameraRig: () => null,
}));

vi.mock('./CarRig', () => ({
  CarRig: () => <div>CarRig</div>,
}));

vi.mock('./GarageEnvironment', () => ({
  GarageEnvironment: () => null,
}));

vi.mock('./GarageInteractables', () => ({
  GarageInteractables: () => null,
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { introState: string }) => string) =>
    selector({ introState: 'idle' }),
}));

afterEach(() => {
  vi.restoreAllMocks();
});

describe('SceneSkeleton', () => {
  it('renders canvas when WebGL 2 is available', async () => {
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      const el = originalCreateElement(tag);
      if (tag === 'canvas') {
        (el as HTMLCanvasElement).getContext = vi.fn().mockReturnValue({
          getParameter: vi.fn().mockReturnValue(4096),
        });
      }
      return el;
    });

    await act(async () => {
      render(<SceneSkeleton />);
    });

    expect(screen.getByTestId('canvas')).toBeInTheDocument();
  });

  it('renders fallback when WebGL 2 is unavailable', async () => {
    await act(async () => {
      render(<SceneSkeleton />);
    });
    expect(screen.getByText(/mobile view/i)).toBeInTheDocument();
  });
});
