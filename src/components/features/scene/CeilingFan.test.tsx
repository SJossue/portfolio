import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CeilingFan } from './CeilingFan';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('CeilingFan', () => {
  it('renders without crashing', () => {
    const { container } = render(<CeilingFan />);
    expect(container).toBeTruthy();
  });
});
