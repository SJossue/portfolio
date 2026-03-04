import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToolBoardDetails } from './ToolBoardDetails';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('ToolBoardDetails', () => {
  it('renders without crashing', () => {
    const { container } = render(<ToolBoardDetails />);
    expect(container).toBeTruthy();
  });
});
