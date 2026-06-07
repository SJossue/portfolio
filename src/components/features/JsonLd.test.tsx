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
    expect(data.name).toBe('Jossue Sarango');
  });

  it('links GitHub and LinkedIn via sameAs', () => {
    const { container } = render(<JsonLd />);
    const script = container.querySelector('script[type="application/ld+json"]');
    const data = JSON.parse(script!.textContent!);
    expect(data.sameAs).toEqual(
      expect.arrayContaining([
        expect.stringContaining('github.com'),
        expect.stringContaining('linkedin.com'),
      ]),
    );
    // mailto: links must not appear in sameAs
    expect(data.sameAs.some((url: string) => url.startsWith('mailto:'))).toBe(false);
  });
});
