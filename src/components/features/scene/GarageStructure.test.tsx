import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GarageStructure } from './GarageStructure';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('GarageStructure', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageStructure />);
    expect(container).toBeTruthy();
  });
});
