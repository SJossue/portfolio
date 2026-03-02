import { render, screen } from '@testing-library/react';

import HomePage from '@/app/page';

describe('HomePage', () => {
  it('renders the foundation heading', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', {
        name: /ship fast, accessible experiences with a structure designed for multiple coding agents/i,
      }),
    ).toBeInTheDocument();
  });
});
