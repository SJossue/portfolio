import { render } from '@testing-library/react';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useFrame: vi.fn(),
}));

vi.mock('@react-three/drei', () => ({
  Box: (props: Record<string, unknown>) => <div data-testid="box" {...props} />,
  Cylinder: (props: Record<string, unknown>) => <div data-testid="cylinder" {...props} />,
}));

vi.mock('gsap', () => ({
  default: {
    timeline: () => ({
      to: vi.fn().mockReturnThis(),
      kill: vi.fn(),
    }),
  },
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { introState: string; setIntroState: () => void }) => unknown) =>
    selector({ introState: 'idle', setIntroState: vi.fn() }),
}));

import { CarRig } from './CarRig';

describe('CarRig', () => {
  it('renders without crashing', () => {
    const { container } = render(<CarRig />);
    expect(container).toBeTruthy();
  });
});
