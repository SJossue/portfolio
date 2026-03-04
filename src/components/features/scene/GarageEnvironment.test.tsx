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
  MeshReflectorMaterial: () => null,
  Sparkles: () => null,
}));

vi.mock('./GarageStructure', () => ({
  GarageStructure: () => <div data-testid="garage-structure" />,
}));

vi.mock('./GaragePipes', () => ({
  GaragePipes: () => <div data-testid="garage-pipes" />,
}));

vi.mock('./GarageShelving', () => ({
  GarageShelving: () => <div data-testid="garage-shelving" />,
}));

vi.mock('./GarageLightFixtures', () => ({
  GarageLightFixtures: () => <div data-testid="garage-light-fixtures" />,
}));

vi.mock('./GarageAtmosphere', () => ({
  GarageAtmosphere: () => <div data-testid="garage-atmosphere" />,
}));

describe('GarageEnvironment', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageEnvironment />);
    expect(container).toBeTruthy();
  });

  it('renders sub-components', () => {
    render(<GarageEnvironment />);
    expect(screen.getByTestId('garage-structure')).toBeInTheDocument();
    expect(screen.getByTestId('garage-pipes')).toBeInTheDocument();
    expect(screen.getByTestId('garage-shelving')).toBeInTheDocument();
    expect(screen.getByTestId('garage-light-fixtures')).toBeInTheDocument();
    expect(screen.getByTestId('garage-atmosphere')).toBeInTheDocument();
  });
});
