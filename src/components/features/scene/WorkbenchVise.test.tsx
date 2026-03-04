import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WorkbenchVise } from './WorkbenchVise';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('WorkbenchVise', () => {
  it('renders without crashing', () => {
    const { container } = render(<WorkbenchVise />);
    expect(container).toBeTruthy();
  });
});
