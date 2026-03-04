import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SwingingChain } from './SwingingChain';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('SwingingChain', () => {
  it('renders without crashing', () => {
    const { container } = render(<SwingingChain />);
    expect(container).toBeTruthy();
  });
});
