import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TireRack } from './TireRack';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('TireRack', () => {
  it('renders without crashing', () => {
    const { container } = render(<TireRack />);
    expect(container).toBeTruthy();
  });
});
