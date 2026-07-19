import { educationData } from './education';
import { researchData } from './research';

describe('education data', () => {
  it('has the core degree fields', () => {
    expect(educationData.schoolShort).toBeTruthy();
    expect(educationData.school).toBeTruthy();
    expect(educationData.degree).toBeTruthy();
  });

  it('exposes optional academic fields as the right types', () => {
    expect(typeof educationData.gpa).toBe('string');
    expect(typeof educationData.gradTerm).toBe('string');
    expect(Array.isArray(educationData.coursework)).toBe(true);
    expect(Array.isArray(educationData.honors)).toBe(true);
  });

  it('lists at least one honor / fellowship', () => {
    expect(educationData.honors.length).toBeGreaterThan(0);
  });
});

describe('research topics', () => {
  it('every paper carries at least one topic tag', () => {
    for (const paper of researchData) {
      expect(Array.isArray(paper.topics)).toBe(true);
      expect(paper.topics?.length ?? 0).toBeGreaterThan(0);
    }
  });
});
