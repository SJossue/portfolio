import { experienceData } from './experience';

describe('experience data', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(experienceData)).toBe(true);
    expect(experienceData.length).toBeGreaterThan(0);
  });

  it('each entry has the required fields', () => {
    for (const e of experienceData) {
      expect(e.id).toBeTruthy();
      expect(e.role).toBeTruthy();
      expect(e.company).toBeTruthy();
      expect(e.period).toBeTruthy();
      expect(e.description).toBeTruthy();
      expect(Array.isArray(e.techStack)).toBe(true);
      expect(e.techStack.length).toBeGreaterThan(0);
    }
  });

  it('each entry has a unique id', () => {
    const ids = experienceData.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every entry is tagged with a valid section', () => {
    for (const e of experienceData) {
      expect(['experience', 'leadership']).toContain(e.section);
    }
  });

  it('has entries in both the experience and leadership sections', () => {
    const bySection = (section: string) => experienceData.filter((e) => e.section === section);
    expect(bySection('experience').length).toBeGreaterThan(0);
    expect(bySection('leadership').length).toBeGreaterThan(0);
  });

  it('logo paths, when present, point to the experience asset folder', () => {
    for (const e of experienceData) {
      if (e.logo) expect(e.logo).toMatch(/^\/experience\/.+\.(png|svg|jpe?g|webp)$/);
    }
  });
});
