# Feature: JSON-LD Structured Data

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add JSON-LD structured data (schema.org Person) to improve SEO and search result appearance.

### Files to create:

1. `src/components/features/JsonLd.tsx` — NEW file
2. `src/components/features/JsonLd.test.tsx` — NEW file

### Files to modify:

1. `src/app/layout.tsx` — import and render JsonLd

### Instructions

**Create `src/components/features/JsonLd.tsx`** with this EXACT content:

```tsx
import { siteConfig } from '@/lib/site';

export function JsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author,
    url: siteConfig.url,
    jobTitle: 'Software Engineer',
    knowsAbout: siteConfig.keywords,
    sameAs: ['https://github.com/SJossue'],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

**Create `src/components/features/JsonLd.test.tsx`** with this EXACT content:

```tsx
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
```

**Modify `src/app/layout.tsx`**: Add `import { JsonLd } from '@/components/features/JsonLd';` at the top imports, then add `<JsonLd />` right after the opening `<body>` tag, before `{children}`.

The body tag should become:
```tsx
      <body className="flex min-h-screen flex-col font-mono antialiased">
        <JsonLd />
        {children}
      </body>
```

### Acceptance Criteria

- JSON-LD script tag renders in the page head with Person schema
- Unit test verifies the script tag and JSON content
- `npm run validate` passes
