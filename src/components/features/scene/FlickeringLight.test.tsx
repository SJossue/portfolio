import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlickeringLight } from './FlickeringLight';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('three', () => ({
  default: {},
}));

describe('FlickeringLight', () => {
  it('renders without crashing', () => {
    const { container } = render(<FlickeringLight />);
    expect(container).toBeTruthy();
  });
});
