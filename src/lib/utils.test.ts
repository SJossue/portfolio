import { toTitleCase } from '@/lib/utils';

describe('toTitleCase', () => {
  it('formats words in title case', () => {
    expect(toTitleCase('heLLo world')).toBe('Hello World');
  });
});
