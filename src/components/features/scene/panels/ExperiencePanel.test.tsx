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
    expect(screen.getByText('Tech Prep Fellow')).toBeInTheDocument();
    expect(screen.getByText('Dec 2025 — Present')).toBeInTheDocument();
  });

  it('renders tech stack tags', () => {
    render(<ExperiencePanel />);
    expect(screen.getAllByText('Leadership').length).toBeGreaterThan(0);
  });
});
