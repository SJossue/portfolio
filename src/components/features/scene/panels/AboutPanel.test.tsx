import { render, screen } from '@testing-library/react';
import { AboutPanel } from './AboutPanel';

describe('AboutPanel', () => {
  it('renders the bio text', () => {
    render(<AboutPanel />);
    expect(screen.getByText(/software engineer focused/i)).toBeInTheDocument();
  });

  it('renders all highlight labels and values', () => {
    render(<AboutPanel />);
    expect(screen.getByText('Focus')).toBeInTheDocument();
    expect(screen.getByText('Full-Stack Web')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Production Systems')).toBeInTheDocument();
    expect(screen.getByText('Approach')).toBeInTheDocument();
    expect(screen.getByText('Ship & Iterate')).toBeInTheDocument();
  });

  it('renders all skill categories', () => {
    render(<AboutPanel />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
    expect(screen.getByText('Practices')).toBeInTheDocument();
  });

  it('renders specific skills', () => {
    render(<AboutPanel />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('TDD')).toBeInTheDocument();
  });
});
