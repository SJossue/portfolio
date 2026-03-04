import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GarageLightFixtures } from './GarageLightFixtures';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('GarageLightFixtures', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageLightFixtures />);
    expect(container).toBeTruthy();
  });
});
