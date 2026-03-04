import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FloorDrain } from './FloorDrain';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('FloorDrain', () => {
  it('renders without crashing', () => {
    const { container } = render(<FloorDrain />);
    expect(container).toBeTruthy();
  });
});
