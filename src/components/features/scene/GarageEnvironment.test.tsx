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
  Edges: () => null,
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

vi.mock('./GarageDecals', () => ({ GarageDecals: () => null }));
vi.mock('./ToolBoardDetails', () => ({ ToolBoardDetails: () => null }));
vi.mock('./OilDrums', () => ({ OilDrums: () => null }));
vi.mock('./TireRack', () => ({ TireRack: () => null }));
vi.mock('./FloorDrain', () => ({ FloorDrain: () => null }));
vi.mock('./FireExtinguisher', () => ({ FireExtinguisher: () => null }));
vi.mock('./WorkbenchVise', () => ({ WorkbenchVise: () => null }));
vi.mock('./HologramDisplay', () => ({ HologramDisplay: () => null }));
vi.mock('./CeilingFan', () => ({ CeilingFan: () => null }));
vi.mock('./FlickeringLight', () => ({ FlickeringLight: () => null }));
vi.mock('./SwingingChain', () => ({ SwingingChain: () => null }));
vi.mock('./WeldingSparks', () => ({ WeldingSparks: () => null }));

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
