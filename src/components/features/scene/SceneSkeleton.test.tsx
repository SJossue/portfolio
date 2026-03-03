import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SceneSkeleton } from './SceneSkeleton';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div>OrbitControls</div>,
}));

vi.mock('./CameraRig', () => ({
  CameraRig: () => null,
}));

vi.mock('./CarRig', () => ({
  CarRig: () => <div>CarRig</div>,
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { introState: string }) => string) =>
    selector({ introState: 'idle' }),
}));

describe('SceneSkeleton', () => {
  it('renders without crashing', async () => {
    render(<SceneSkeleton />);
    expect(await screen.findByText('OrbitControls')).toBeInTheDocument();
  });
});
