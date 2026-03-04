import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FireExtinguisher } from './FireExtinguisher';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('FireExtinguisher', () => {
  it('renders without crashing', () => {
    const { container } = render(<FireExtinguisher />);
    expect(container).toBeTruthy();
  });
});
