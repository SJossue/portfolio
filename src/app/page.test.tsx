import { render, screen } from '@testing-library/react';

import Home from './page';

// Mock the HomeScene client component
vi.mock('@/components/features/scene/HomeScene', () => ({
  HomeScene: () => <div data-testid="home-scene">HomeScene</div>,
}));

describe('Home page', () => {
  it('renders main landmark', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders HomeScene', () => {
    render(<Home />);
    expect(screen.getByTestId('home-scene')).toBeInTheDocument();
  });
});
