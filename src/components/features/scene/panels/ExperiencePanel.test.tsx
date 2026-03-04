import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperiencePanel } from './ExperiencePanel';

describe('ExperiencePanel', () => {
  it('renders without crashing', () => {
    const { container } = render(<ExperiencePanel />);
    expect(container).toBeTruthy();
  });

  it('renders experience entries', () => {
    render(<ExperiencePanel />);
    expect(screen.getByText('Full-Stack Engineer')).toBeInTheDocument();
    expect(screen.getByText('2024 — Present')).toBeInTheDocument();
  });

  it('renders tech stack tags', () => {
    render(<ExperiencePanel />);
    expect(screen.getByText('Three.js')).toBeInTheDocument();
  });
});
