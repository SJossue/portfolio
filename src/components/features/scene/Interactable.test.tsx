import { render } from '@testing-library/react';

vi.mock('@react-three/drei', () => ({
  Box: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  ),
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (selector: (s: { setSelectedSection: () => void }) => unknown) =>
    selector({ setSelectedSection: vi.fn() }),
}));

import { Interactable } from './Interactable';

describe('Interactable', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Interactable
        id="test"
        label="Test"
        section="projects"
        position={[0, 0, 0]}
        color="#ff0000"
      />,
    );
    expect(container).toBeTruthy();
  });
});
