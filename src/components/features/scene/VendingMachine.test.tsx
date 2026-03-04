import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VendingMachine } from './VendingMachine';

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

vi.mock('./NeonTube', () => ({
  NeonTube: () => null,
}));

describe('VendingMachine', () => {
  it('renders without crashing', () => {
    const { container } = render(<VendingMachine />);
    expect(container).toBeTruthy();
  });
});
