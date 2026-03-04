import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GaragePipes } from './GaragePipes';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('GaragePipes', () => {
  it('renders without crashing', () => {
    const { container } = render(<GaragePipes />);
    expect(container).toBeTruthy();
  });
});
