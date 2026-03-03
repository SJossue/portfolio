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
