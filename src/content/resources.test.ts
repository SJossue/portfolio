import { resourceStages } from './resources';

describe('resource stages data', () => {
  it('exports exactly the 4 expected stages, in order', () => {
    expect(resourceStages.map((s) => s.id)).toEqual([
      'high-school',
      'college',
      'internships-fellowships',
      'programs-orgs',
    ]);
  });

  it('every stage has required fields and at least one item', () => {
    for (const stage of resourceStages) {
      expect(stage.name).toBeTruthy();
      expect(stage.subtitle).toBeTruthy();
      expect(stage.intro).toBeTruthy();
      expect(stage.items.length).toBeGreaterThan(0);
    }
  });

  it('every item has required fields', () => {
    for (const stage of resourceStages) {
      for (const item of stage.items) {
        expect(item.id).toBeTruthy();
        expect(item.title).toBeTruthy();
        expect(item.type).toBeTruthy();
        expect(item.note).toBeTruthy();
      }
    }
  });

  it('every item id is unique across all stages', () => {
    const ids = resourceStages.flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
