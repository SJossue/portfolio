import { DEPT_CHOICES, EARLY_CHOICES, isValidChoiceId, labelFor } from './field-test';

describe('field-test content helpers', () => {
  it('resolves a known choice id to its title', () => {
    expect(labelFor(DEPT_CHOICES, 'cold-email')).toBe('Send the cold email today.');
    expect(labelFor(EARLY_CHOICES, 'jump-in')).toBe("Jump in on whoever's behind.");
  });

  it('falls back to the raw id for an unknown choice', () => {
    expect(labelFor(DEPT_CHOICES, 'not-a-real-id')).toBe('not-a-real-id');
  });

  it('validates choice ids against the known set', () => {
    expect(isValidChoiceId(DEPT_CHOICES, 'ask-chapter')).toBe(true);
    expect(isValidChoiceId(DEPT_CHOICES, 'jump-in')).toBe(false);
  });
});
