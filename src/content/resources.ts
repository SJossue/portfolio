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
  /** Absolute URL for the resource. Optional only for entries with no single canonical link. */
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

export const resourceStages: ResourceStage[] = [
  {
    id: 'high-school',
    name: 'High School',
    subtitle: 'Getting ready for what comes next',
    intro:
      "The two things that mattered most before I got to campus: finding people a few years ahead who'd actually done it, and not leaving financial aid money on the table.",
    items: [
      {
        id: 'hs-hispa',
        title: 'HISPA — Role Model Program',
        type: 'program',
        url: 'https://www.hispa.org/',
        tags: ['college prep', 'mentorship'],
        note: "HISPA sends Latino professionals into schools to talk through their own education and career paths — closing the gap where a lot of students just don't have a role model who's done the STEM/college thing before. This one's personal: during my NJ Governor's Fellowship, my team's 8-week strategic plan was adopted by HISPA directly.",
      },
      {
        id: 'hs-fafsa',
        title: 'FAFSA — Federal Student Aid',
        type: 'tool',
        url: 'https://studentaid.gov/',
        tags: ['financial aid'],
        note: "The actual U.S. Department of Education site — studentaid.gov, not a lookalike that charges a 'filing fee.' File as early as the window opens; aid at a lot of schools is first-come, first-served even when the deadline says otherwise.",
      },
    ],
  },
  {
    id: 'college',
    name: 'College',
    subtitle: 'Making the most of it',
    intro:
      'What actually moved the needle for me: getting plugged into an organization early, and not assuming research or advising was for someone else.',
    items: [
      {
        id: 'college-career-advisor',
        title: 'Find Your Career Advisor',
        type: 'article',
        url: 'https://www.njit.edu/careerservices/find-your-career-advisor',
        tags: ['career services'],
        note: "Every NJIT major has a dedicated career advisor for one-on-one help with your search, applications, resume, and offers. Meet with yours early — I waited too long to start and wish I hadn't.",
      },
      {
        id: 'college-uri',
        title: 'NJIT Undergraduate Research & Innovation (URI)',
        type: 'program',
        url: 'https://research.njit.edu/uri/undergraduate-research-and-innovation-uri-program',
        tags: ['research', 'funding'],
        note: "Pairs undergrads with a faculty advisor on paid research — a $5,000 stipend for the 10-week Summer Fellowship, or smaller $500–$3,000 seed grants if you'd rather prototype your own idea. I assumed 'research' meant grad students only for way too long; it doesn't.",
      },
    ],
  },
  {
    id: 'internships-fellowships',
    name: 'Internships & Fellowships',
    subtitle: 'Real-world experience',
    intro:
      "Where I actually found internships and fellowships, and what to do with them once you're in — not just where to apply.",
    items: [
      {
        id: 'if-handshake',
        title: 'Handshake',
        type: 'tool',
        url: 'https://njit.joinhandshake.com/',
        tags: ['job search'],
        note: "NJIT's official portal for jobs and internships, advising appointments, workshops, and career fair registration. Sign in with your UCID and check it weekly, not just when you're actively searching.",
      },
      {
        id: 'if-coop-internship',
        title: 'Co-op & Internship at NJIT',
        type: 'program',
        url: 'https://www.njit.edu/careerservices/co-op-internship',
        tags: ['co-op'],
        note: 'How NJIT co-ops and internships actually work — eligibility, timelines, and how to get academic credit. Read it before you accept an offer, not after.',
      },
      {
        id: 'if-mlt',
        title: 'MLT CareerPrep Fellowship',
        type: 'fellowship',
        url: 'https://mlt.org/career-prep/',
        tags: ['fellowship', 'career prep'],
        note: "A competitive 20-month fellowship for Black, Hispanic/Latinx, and Native American/Indigenous student leaders — technical interview prep, coaching, and a network of thousands of MLT Rising Leaders. I'm in it now; the case prep alone has been worth the time.",
      },
      {
        id: 'if-any-firstgenu',
        title: 'America Needs You — FirstGenU',
        type: 'fellowship',
        url: 'https://americaneedsyou.org/',
        tags: ['fellowship', 'first-gen'],
        note: 'A national fellowship for first-generation college students — structured training in professional communication, project management, and job search strategy. I did it my sophomore year, and it is a big part of why I stopped winging networking conversations.',
      },
    ],
  },
  {
    id: 'programs-orgs',
    name: 'Programs & Organizations',
    subtitle: 'Community and support',
    intro:
      'The organizations that gave me an actual foothold — a chapter to belong to, and a network big enough to open doors past NJIT.',
    items: [
      {
        id: 'po-shpe-membership',
        title: 'SHPE — Become a Member',
        type: 'organization',
        url: 'https://shpe.org/membership/become-a-member/',
        tags: ['community', 'networking'],
        note: "Joining SHPE nationally is what plugs you into your local chapter. It's the single thing that moved the needle most for me in college — I went from general member to Internal Vice President at NJIT, and most of my engineering opportunities trace back to people I met through it.",
      },
      {
        id: 'po-shpe-convention',
        title: 'SHPE National Convention',
        type: 'program',
        url: 'https://www.shpe.org/events/national-convention',
        tags: ['career fair', 'networking'],
        note: "The largest gathering of Hispanic STEM students and professionals, with a career fair where companies recruit and interview on site. I'm heading to the 2026 Convention with our chapter — worth the trip.",
      },
      {
        id: 'po-scholarshpe',
        title: 'ScholarSHPE',
        type: 'scholarship',
        url: 'https://shpe.org/engage/programs/scholarshpe/',
        tags: ['funding'],
        note: "SHPE's own scholarship program for members pursuing STEM degrees. Apply every cycle you're eligible for — it costs an afternoon, not much else.",
      },
    ],
  },
];
