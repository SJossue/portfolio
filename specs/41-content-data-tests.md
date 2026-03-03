# Feature: Content Data Tests

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

Add unit tests for the content data modules to ensure data integrity and guard against accidental breakage during edits.

### Files to create:

1. `src/content/projects.test.ts` — NEW file
2. `src/content/about.test.ts` — NEW file
3. `src/content/contact.test.ts` — NEW file

### Instructions

**Create `src/content/projects.test.ts`** with this EXACT content:

```ts
import { projects } from './projects';

describe('projects data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
  });

  it('each project has required fields', () => {
    for (const p of projects) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(Array.isArray(p.techStack)).toBe(true);
      expect(p.techStack.length).toBeGreaterThan(0);
    }
  });

  it('each project has a unique id', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

**Create `src/content/about.test.ts`** with this EXACT content:

```ts
import { aboutData } from './about';

describe('aboutData', () => {
  it('has a non-empty bio', () => {
    expect(aboutData.bio.length).toBeGreaterThan(0);
  });

  it('has skill groups with items', () => {
    expect(aboutData.skills.length).toBeGreaterThan(0);
    for (const group of aboutData.skills) {
      expect(group.category).toBeTruthy();
      expect(group.items.length).toBeGreaterThan(0);
    }
  });

  it('has highlights with label and value', () => {
    expect(aboutData.highlights.length).toBeGreaterThan(0);
    for (const h of aboutData.highlights) {
      expect(h.label).toBeTruthy();
      expect(h.value).toBeTruthy();
    }
  });
});
```

**Create `src/content/contact.test.ts`** with this EXACT content:

```ts
import { contactLinks } from './contact';

describe('contactLinks', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(contactLinks)).toBe(true);
    expect(contactLinks.length).toBeGreaterThan(0);
  });

  it('each link has required fields', () => {
    for (const link of contactLinks) {
      expect(link.id).toBeTruthy();
      expect(link.label).toBeTruthy();
      expect(link.href).toBeTruthy();
      expect(link.icon).toBeTruthy();
    }
  });

  it('each link has a unique id', () => {
    const ids = contactLinks.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
```

Do NOT modify any existing files.

### Acceptance Criteria

- 3 new test files created in `src/content/`
- Tests verify data structure, required fields, and unique IDs
- All tests pass
- `npm run validate` passes
