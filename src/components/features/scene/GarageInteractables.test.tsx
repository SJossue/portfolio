import { render } from '@testing-library/react';

let mockIntroState = 'garage';

vi.mock('@react-three/drei', () => ({
  Box: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
  Html: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="html-label">{children}</div>
  ),
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (
    selector: (s: { introState: string; setSelectedSection: () => void }) => unknown,
  ) => selector({ introState: mockIntroState, setSelectedSection: vi.fn() }),
}));

import { GarageInteractables } from './GarageInteractables';

afterEach(() => {
  mockIntroState = 'garage';
});

describe('GarageInteractables', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageInteractables />);
    expect(container).toBeTruthy();
  });

  it('renders four interactable items when in garage state', () => {
    const { getAllByTestId } = render(<GarageInteractables />);
    expect(getAllByTestId('box')).toHaveLength(4);
  });

  it('renders nothing when introState is not garage', () => {
    mockIntroState = 'idle';
    const { container } = render(<GarageInteractables />);
    expect(container.innerHTML).toBe('');
  });
});
