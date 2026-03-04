import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CyberpunkPoster } from './CyberpunkPoster';

describe('CyberpunkPoster', () => {
  it('renders without crashing', () => {
    const { container } = render(<CyberpunkPoster position={[0, 0, 0]} />);
    expect(container).toBeTruthy();
  });
});
