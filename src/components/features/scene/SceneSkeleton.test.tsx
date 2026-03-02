import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SceneSkeleton } from './SceneSkeleton';

// Mock the 3D libraries to avoid complex rendering in tests
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useFrame: () => {},
}));

vi.mock('@react-three/drei', () => ({
  OrbitControls: () => <div>OrbitControls</div>,
  Box: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Cylinder: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('SceneSkeleton', () => {
  it('renders without crashing', async () => {
    render(<SceneSkeleton />);
    // Wait for the async 500ms delay to finish before asserting rendering
    expect(await screen.findByText('OrbitControls')).toBeInTheDocument();
  });
});
