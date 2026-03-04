import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SecurityCamera } from './SecurityCamera';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('three', () => ({
  default: {},
}));

vi.mock('./useSceneState', () => ({
  useSceneState: () => () => {},
}));

describe('SecurityCamera', () => {
  it('renders without crashing', () => {
    const { container } = render(<SecurityCamera />);
    expect(container).toBeTruthy();
  });
});
