import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GarageEnvironment } from './GarageEnvironment';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  ContactShadows: (props: Record<string, unknown>) => (
    <div data-testid="contact-shadows" data-opacity={props.opacity} />
  ),
}));

describe('GarageEnvironment', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageEnvironment />);
    expect(container).toBeTruthy();
  });

  it('renders ContactShadows', () => {
    render(<GarageEnvironment />);
    expect(screen.getByTestId('contact-shadows')).toBeInTheDocument();
  });
});
