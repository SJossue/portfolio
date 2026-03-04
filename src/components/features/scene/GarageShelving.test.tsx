import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GarageShelving } from './GarageShelving';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('GarageShelving', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageShelving />);
    expect(container).toBeTruthy();
  });
});
