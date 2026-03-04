import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OilDrums } from './OilDrums';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('OilDrums', () => {
  it('renders without crashing', () => {
    const { container } = render(<OilDrums />);
    expect(container).toBeTruthy();
  });
});
