import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { NeonOpenSign } from './NeonOpenSign';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('three', () => ({
  default: {},
  MeshStandardMaterial: class {},
  Mesh: class {},
  Group: class {},
}));

describe('NeonOpenSign', () => {
  it('renders without crashing', () => {
    const { container } = render(<NeonOpenSign />);
    expect(container).toBeTruthy();
  });
});
