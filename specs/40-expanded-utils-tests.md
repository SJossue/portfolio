# Feature: Expanded Utils Tests

**Status**: `approved`
**Owner**: Agent
**Created**: 2026-03-03

## Task

The `toTitleCase` function in `src/lib/utils.ts` only has one test. Add comprehensive edge-case tests.

### Files to modify (ONLY these files):

1. `src/lib/utils.test.ts` — replace entire file

### Instructions

Replace the entire content of `src/lib/utils.test.ts` with:

```ts
import { toTitleCase } from '@/lib/utils';

describe('toTitleCase', () => {
  it('formats words in title case', () => {
    expect(toTitleCase('heLLo world')).toBe('Hello World');
  });

  it('handles single word', () => {
    expect(toTitleCase('hello')).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(toTitleCase('')).toBe('');
  });

  it('handles already title-cased input', () => {
    expect(toTitleCase('Hello World')).toBe('Hello World');
  });

  it('handles all uppercase input', () => {
    expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('handles all lowercase input', () => {
    expect(toTitleCase('hello world')).toBe('Hello World');
  });

  it('filters extra spaces', () => {
    expect(toTitleCase('hello  world')).toBe('Hello World');
  });

  it('handles leading and trailing spaces', () => {
    expect(toTitleCase('  hello world  ')).toBe('Hello World');
  });
});
```

### Acceptance Criteria

- `utils.test.ts` has 8 tests covering edge cases
- All tests pass
- `npm run validate` passes
