import { render, screen } from '@testing-library/react';

import FieldTestPage from './page';

describe('IVP Committee Screening page', () => {
  it('renders main landmark with skip-link id', () => {
    render(<FieldTestPage />);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('renders the intro step first', () => {
    render(<FieldTestPage />);
    expect(screen.getByRole('heading', { name: 'IVP Committee Screening' })).toBeInTheDocument();
  });
});
