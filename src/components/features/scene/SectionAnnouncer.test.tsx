import { render, screen } from '@testing-library/react';
import { SectionAnnouncer } from './SectionAnnouncer';

let mockSelectedSection: string | null = null;

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { selectedSection: string | null }) => unknown) =>
    selector({ selectedSection: mockSelectedSection }),
}));

describe('SectionAnnouncer', () => {
  beforeEach(() => {
    mockSelectedSection = null;
  });

  it('renders an aria-live region', () => {
    render(<SectionAnnouncer />);
    const el = screen.getByTestId('section-announcer');
    expect(el).toHaveAttribute('role', 'status');
    expect(el).toHaveAttribute('aria-live', 'polite');
  });

  it('is visually hidden', () => {
    render(<SectionAnnouncer />);
    const el = screen.getByTestId('section-announcer');
    expect(el).toHaveClass('sr-only');
  });

  it('has empty text when no section is selected', () => {
    render(<SectionAnnouncer />);
    expect(screen.getByTestId('section-announcer')).toHaveTextContent('');
  });

  it('announces the section when selected', () => {
    mockSelectedSection = 'projects';
    render(<SectionAnnouncer />);
    expect(screen.getByTestId('section-announcer')).toHaveTextContent('projects section opened');
  });
});
