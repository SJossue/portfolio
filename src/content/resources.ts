export type ResourceStageId =
  | 'high-school'
  | 'college'
  | 'internships-fellowships'
  | 'programs-orgs';

export type ResourceItemType =
  | 'program'
  | 'scholarship'
  | 'fellowship'
  | 'organization'
  | 'tool'
  | 'article';

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceItemType;
  /** External link — omitted for placeholder entries pending a real one. */
  url?: string;
  tags?: string[];
  /** Your personal take — why it's here, your experience with it. */
  note: string;
}

export interface ResourceStage {
  id: ResourceStageId;
  name: string;
  subtitle: string;
  /** Personal blurb introducing the stage — shown in full in the stage view. */
  intro: string;
  items: ResourceItem[];
}

/**
 * Scaffold content — every item below is a clearly-marked placeholder. Replace
 * titles, tags, notes, and add real `url`s as a content pass; keep the shape.
 */
export const resourceStages: ResourceStage[] = [
  {
    id: 'high-school',
    name: 'High School',
    subtitle: 'Getting ready for what comes next',
    intro:
      "This is a starting scaffold — swap these in for the programs, deadlines, and advice you'd actually hand a high schooler asking where to begin.",
    items: [
      {
        id: 'hs-placeholder-1',
        title: 'Placeholder — a college-readiness program',
        type: 'program',
        tags: ['college prep'],
        note: 'Placeholder entry. Replace with a real program and your own note on why it matters.',
      },
      {
        id: 'hs-placeholder-2',
        title: 'Placeholder — a financial aid resource',
        type: 'article',
        tags: ['financial aid'],
        note: 'Placeholder entry. Replace with a real resource and your own note on why it matters.',
      },
    ],
  },
  {
    id: 'college',
    name: 'College',
    subtitle: 'Making the most of it',
    intro:
      'This is a starting scaffold — swap these in for the clubs, research opportunities, and habits that actually moved the needle for you in college.',
    items: [
      {
        id: 'college-placeholder-1',
        title: 'Placeholder — a student organization',
        type: 'organization',
        tags: ['community'],
        note: 'Placeholder entry. Replace with a real organization and your own note on why it matters.',
      },
      {
        id: 'college-placeholder-2',
        title: 'Placeholder — a research or lab opportunity',
        type: 'program',
        tags: ['research'],
        note: 'Placeholder entry. Replace with a real opportunity and your own note on why it matters.',
      },
    ],
  },
  {
    id: 'internships-fellowships',
    name: 'Internships & Fellowships',
    subtitle: 'Real-world experience',
    intro:
      "This is a starting scaffold — swap these in for the internships and fellowships worth a student's time, plus what actually happens once they get in.",
    items: [
      {
        id: 'if-placeholder-1',
        title: 'Placeholder — a fellowship program',
        type: 'fellowship',
        tags: ['fellowship'],
        note: 'Placeholder entry. Replace with a real fellowship and your own note on why it matters.',
      },
      {
        id: 'if-placeholder-2',
        title: 'Placeholder — where to find internships',
        type: 'tool',
        tags: ['internships'],
        note: 'Placeholder entry. Replace with a real tool or site and your own note on why it matters.',
      },
    ],
  },
  {
    id: 'programs-orgs',
    name: 'Programs & Organizations',
    subtitle: 'Community and support',
    intro:
      'This is a starting scaffold — swap these in for the organizations and communities that gave you a foothold.',
    items: [
      {
        id: 'po-placeholder-1',
        title: 'Placeholder — a professional organization',
        type: 'organization',
        tags: ['community'],
        note: 'Placeholder entry. Replace with a real organization and your own note on why it matters.',
      },
      {
        id: 'po-placeholder-2',
        title: 'Placeholder — a scholarship program',
        type: 'scholarship',
        tags: ['funding'],
        note: 'Placeholder entry. Replace with a real scholarship and your own note on why it matters.',
      },
    ],
  },
];
