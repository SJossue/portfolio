import { render, fireEvent } from '@testing-library/react';

const mockSetSelectedSection = vi.fn();

vi.mock('@react-three/drei', () => ({
  Box: ({
    children,
    onClick,
    onPointerOver,
    onPointerOut,
    ...props
  }: {
    children?: React.ReactNode;
    onClick?: () => void;
    onPointerOver?: (e: { stopPropagation: () => void }) => void;
    onPointerOut?: () => void;
    [key: string]: unknown;
  }) => (
    <div
      data-testid="box"
      onClick={onClick}
      onMouseEnter={() => onPointerOver?.({ stopPropagation: () => {} })}
      onMouseLeave={() => onPointerOut?.()}
      {...props}
    >
      {children}
    </div>
  ),
}));

vi.mock('./useSceneState', () => ({
  useSceneState: (
    selector: (s: { setSelectedSection: typeof mockSetSelectedSection }) => unknown,
  ) => selector({ setSelectedSection: mockSetSelectedSection }),
}));

import { Interactable } from './Interactable';

afterEach(() => {
  mockSetSelectedSection.mockClear();
  document.body.style.cursor = 'default';
});

describe('Interactable', () => {
  const defaultProps = {
    id: 'test',
    label: 'Test',
    section: 'projects',
    position: [0, 0, 0] as [number, number, number],
    color: '#ff0000',
  };

  it('renders without crashing', () => {
    const { container } = render(<Interactable {...defaultProps} />);
    expect(container).toBeTruthy();
  });

  it('calls setSelectedSection on click', () => {
    const { getByTestId } = render(<Interactable {...defaultProps} />);
    fireEvent.click(getByTestId('box'));
    expect(mockSetSelectedSection).toHaveBeenCalledWith('projects');
  });

  it('sets cursor to pointer on hover', () => {
    const { getByTestId } = render(<Interactable {...defaultProps} />);
    fireEvent.mouseEnter(getByTestId('box'));
    expect(document.body.style.cursor).toBe('pointer');
  });

  it('resets cursor on pointer out', () => {
    const { getByTestId } = render(<Interactable {...defaultProps} />);
    fireEvent.mouseEnter(getByTestId('box'));
    fireEvent.mouseLeave(getByTestId('box'));
    expect(document.body.style.cursor).toBe('default');
  });
});
