import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OverlayPanel } from './OverlayPanel';

vi.mock('gsap', () => {
  const fromTo = (_target: unknown, _from: unknown, to: { onComplete?: () => void }) => {
    to.onComplete?.();
  };
  const to = (_target: unknown, vars: { onComplete?: () => void }) => {
    vars.onComplete?.();
  };
  return { default: { fromTo, to } };
});

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

  it('has dialog role with aria-modal', () => {
    render(<OverlayPanel section="projects" onClose={vi.fn()} />);
    const dialog = screen.getByRole('dialog', { name: /projects/i });
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn();
    render(<OverlayPanel section="projects" onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('focuses close button on mount', () => {
    render(<OverlayPanel section="projects" onClose={vi.fn()} />);
    expect(screen.getByTestId('close-panel')).toHaveFocus();
  });
});
