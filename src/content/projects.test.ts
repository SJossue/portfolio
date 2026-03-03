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
