import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders the foundation heading', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', {
        name: /jossue/i,
      }),
    ).toBeInTheDocument();
  });

  it('renders the portfolio description', () => {
    render(<HomePage />);

    expect(
      screen.getByText(
        /a personal portfolio and engineering showcase built with next\.js, tailwind, and typescript\./i,
      ),
    ).toBeInTheDocument();
  });

  it('renders architecture checks section', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', {
        name: /architecture checks/i,
      }),
    ).toBeInTheDocument();
  });
});
