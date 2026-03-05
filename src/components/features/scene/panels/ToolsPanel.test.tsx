import { render, screen } from '@testing-library/react';
import { ToolsPanel } from './ToolsPanel';

describe('ToolsPanel', () => {
  it('renders introductory text', () => {
    render(<ToolsPanel />);
    expect(screen.getByText(/technologies and tools/i)).toBeInTheDocument();
  });

  it('renders all category headings', () => {
    render(<ToolsPanel />);
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Frameworks')).toBeInTheDocument();
    expect(screen.getByText('DevOps')).toBeInTheDocument();
    expect(screen.getByText('Tools')).toBeInTheDocument();
  });
});
