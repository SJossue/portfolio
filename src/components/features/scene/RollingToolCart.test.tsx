import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RollingToolCart } from './RollingToolCart';

vi.mock('./useSceneState', () => ({
  useSceneState: () => () => {},
}));

describe('RollingToolCart', () => {
  it('renders without crashing', () => {
    const { container } = render(<RollingToolCart />);
    expect(container).toBeTruthy();
  });
});
