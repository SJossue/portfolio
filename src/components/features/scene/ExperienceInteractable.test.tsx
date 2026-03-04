import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExperienceInteractable } from './ExperienceInteractable';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

describe('ExperienceInteractable', () => {
  it('renders without crashing', () => {
    const { container } = render(<ExperienceInteractable hovered={false} />);
    expect(container).toBeTruthy();
  });
});
