import { render } from '@testing-library/react';
import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  it('renders a script tag with application/ld+json type', () => {
    const { container } = render(<JsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
  });

  it('contains valid JSON with Person schema', () => {
    const { container } = render(<JsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    expect(data['@type']).toBe('Person');
    expect(data.name).toBe('Jossue');
  });
});
