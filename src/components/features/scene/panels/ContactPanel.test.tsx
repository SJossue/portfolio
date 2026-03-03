import { render, screen } from '@testing-library/react';
import { ContactPanel } from './ContactPanel';

describe('ContactPanel', () => {
  it('renders the introductory text', () => {
    render(<ContactPanel />);
    expect(screen.getByText(/get in touch/i)).toBeInTheDocument();
  });

  it('renders all contact links', () => {
    render(<ContactPanel />);
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument();
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders links with correct attributes', () => {
    render(<ContactPanel />);
    const githubLink = screen.getByLabelText('GitHub');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/SJossue');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders contact icons', () => {
    render(<ContactPanel />);
    expect(screen.getByText('/>')).toBeInTheDocument();
    expect(screen.getByText('in')).toBeInTheDocument();
    expect(screen.getByText('@')).toBeInTheDocument();
  });
});
