import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GarageDecals } from './GarageDecals';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('GarageDecals', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageDecals />);
    expect(container).toBeTruthy();
  });
});
