import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HologramDisplay } from './HologramDisplay';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  Edges: () => null,
}));

describe('HologramDisplay', () => {
  it('renders without crashing', () => {
    const { container } = render(<HologramDisplay />);
    expect(container).toBeTruthy();
  });
});
