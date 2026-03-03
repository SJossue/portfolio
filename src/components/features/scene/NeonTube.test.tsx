import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NeonTube } from './NeonTube';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('NeonTube', () => {
  it('renders without crashing', () => {
    const { container } = render(<NeonTube position={[0, 0, 0]} length={2} color="#00f0ff" />);
    expect(container).toBeTruthy();
  });
});
