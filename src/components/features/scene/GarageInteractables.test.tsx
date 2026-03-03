import { render } from '@testing-library/react';

vi.mock('@react-three/drei', () => ({
  Box: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (
    selector: (s: { introState: string; setSelectedSection: () => void }) => unknown,
  ) => selector({ introState: 'garage', setSelectedSection: vi.fn() }),
}));

import { GarageInteractables } from './GarageInteractables';

describe('GarageInteractables', () => {
  it('renders without crashing', () => {
    const { container } = render(<GarageInteractables />);
    expect(container).toBeTruthy();
  });
});
