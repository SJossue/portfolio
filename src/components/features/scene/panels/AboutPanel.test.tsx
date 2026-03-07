import { render, screen } from '@testing-library/react';
import { AboutPanel } from './AboutPanel';

describe('AboutPanel', () => {
  it('renders the bio text', () => {
    render(<AboutPanel />);
    expect(screen.getByText(/I build things — physical and digital/i)).toBeInTheDocument();
  });

  it('renders all highlight labels and values', () => {
    render(<AboutPanel />);
    expect(screen.getByText('Philosophy')).toBeInTheDocument();
    expect(screen.getByText('Learn by Building')).toBeInTheDocument();
    expect(screen.getByText('Pillars')).toBeInTheDocument();
    expect(screen.getByText('Execution, Systems, Leadership')).toBeInTheDocument();
  });

  it('renders all skill categories', () => {
    render(<AboutPanel />);
    expect(screen.getByText('Mechanical Eng')).toBeInTheDocument();
    expect(screen.getByText('Software & Product')).toBeInTheDocument();
    expect(screen.getByText('Systems & AI')).toBeInTheDocument();
    expect(screen.getByText('Leadership')).toBeInTheDocument();
  });

  it('renders specific skills', () => {
    render(<AboutPanel />);
    expect(screen.getByText('SolidWorks')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Automation')).toBeInTheDocument();
  });
});
