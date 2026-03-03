import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverlayPanel } from './OverlayPanel';

describe('OverlayPanel', () => {
  it('renders section heading', () => {
    render(<OverlayPanel section="projects" onClose={vi.fn()} />);
    expect(screen.getByRole('heading', { name: /projects/i })).toBeInTheDocument();
  });

  it('renders section description', () => {
    render(<OverlayPanel section="projects" onClose={vi.fn()} />);
    expect(screen.getByText(/curated selection/i)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<OverlayPanel section="projects" onClose={onClose} />);
    await userEvent.click(screen.getByTestId('close-panel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('has dialog role and aria-label', () => {
    render(<OverlayPanel section="projects" onClose={vi.fn()} />);
    expect(screen.getByRole('dialog', { name: /projects/i })).toBeInTheDocument();
  });
});
