import { render, screen } from '@testing-library/react';

import Home from './page';

// Mock the ScrollPortfolio (default view) and HomeScene (lazy-loaded 3D view)
vi.mock('@/components/features/portfolio', () => ({
  ScrollPortfolio: ({ onEnter3D }: { onEnter3D: () => void }) => (
    <div data-testid="scroll-portfolio">
      <button onClick={onEnter3D}>Enter 3D World</button>
    </div>
  ),
}));

vi.mock('@/components/features/scene/HomeScene', () => ({
  HomeScene: ({ onExit3D }: { onExit3D?: () => void }) => (
    <div data-testid="home-scene">{onExit3D && <button onClick={onExit3D}>Back</button>}</div>
  ),
}));

describe('Home page', () => {
  it('renders main landmark', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders ScrollPortfolio by default', () => {
    render(<Home />);
    expect(screen.getByTestId('scroll-portfolio')).toBeInTheDocument();
  });

  it('main has correct id for skip link target', () => {
    render(<Home />);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });
});
