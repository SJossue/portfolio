import { render, screen } from '@testing-library/react';

import Home from './page';

// Mock the HubCarousel (dynamically imported client component).
vi.mock('@/components/features/hub/HubCarousel', () => ({
  default: () => <div data-testid="hub-carousel" />,
}));

describe('Home page', () => {
  it('renders main landmark', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('main has correct id for skip link target', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });
});
