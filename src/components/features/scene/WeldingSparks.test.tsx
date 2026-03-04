import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WeldingSparks } from './WeldingSparks';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  Sparkles: () => null,
}));

describe('WeldingSparks', () => {
  it('renders without crashing', () => {
    const { container } = render(<WeldingSparks />);
    expect(container).toBeTruthy();
  });
});
