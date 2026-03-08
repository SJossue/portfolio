import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResumeButton } from './ResumeButton';

describe('ResumeButton', () => {
  it('renders download link', () => {
    render(<ResumeButton />);
    const link = screen.getByRole('link', { name: /download resume/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/resume/JossueSarango-Resume.pdf');
    expect(link).toHaveAttribute('download');
  });
});
