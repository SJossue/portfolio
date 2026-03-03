import { render } from '@testing-library/react';

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: () => ({
    camera: {
      position: { lerp: vi.fn(), set: vi.fn(), x: 0, y: 0, z: 0 },
      lookAt: vi.fn(),
    },
  }),
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { introState: string }) => string) =>
    selector({ introState: 'idle' }),
}));

import { CameraRig } from './CameraRig';

describe('CameraRig', () => {
  it('renders without crashing', () => {
    const { container } = render(<CameraRig />);
    expect(container).toBeTruthy();
  });
});
