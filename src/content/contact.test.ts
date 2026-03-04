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
