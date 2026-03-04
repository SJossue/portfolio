import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GarageAtmosphere } from './GarageAtmosphere';

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
  Sparkles: () => null,
}));

describe('GarageAtmosphere', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageAtmosphere />);
    expect(container).toBeTruthy();
  });

  it('renders ContactShadows', () => {
    render(<GarageAtmosphere />);
    expect(screen.getByTestId('contact-shadows')).toBeInTheDocument();
  });
});
