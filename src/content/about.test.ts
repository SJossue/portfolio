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
