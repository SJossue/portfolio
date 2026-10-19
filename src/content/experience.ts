export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  /** Which band the role lives in on the timeline page. */
  section: 'experience' | 'leadership';
  description: string;
  techStack: string[];
  achievements?: string[];
  images?: string[];
  /** Path to a real org logo under /public; falls back to a monogram tile when absent. */
  logo?: string;
}

// Curated display order within each section (roughly most-recent-first). The
// timeline page filters by `section` and renders in array order, so this
// ordering is the source of truth for display — no date parsing at render.
export const experienceData: ExperienceEntry[] = [
  // ── Experience ──────────────────────────────────────────────────────────
  {
    id: 'njit-career-services',
    role: 'Program Lead',
    company: 'NJIT Career Services',
    period: 'Sep 2026 — Present',
    section: 'experience',
    description:
      "Lead NJIT Career Services' undergraduate engineering co-op pipeline: employer research and business development, posting-eligibility review, program data and assessment (reference lists, testimonials, trend analysis), student communications, and career-resource upkeep.",
    techStack: ['Employer Research', 'Program Assessment', 'Student Communications'],
  },
  {
    id: 'pseg',
    role: 'Project Management Intern',
    company: 'PSEG (Public Service Enterprise Group)',
    period: 'Jun 2026 — Aug 2026',
    section: 'experience',
    description:
      'Authored the civil and layout design review (IFR pageturn) for a 138kV ring-bus substation expansion, validating structural steel alignment, H-frame foundation elevations, and disconnect-switch coordination against geotechnical and survey data. Audited legacy foundation drawings and ran field walkdowns across a $60M+, 5-project substation portfolio, matching CAD drawings to as-built conditions and introducing verification test pits after identifying legacy foundations 5 ft below grade.',
    techStack: [
      'Electrical T&D',
      'Substation Design Review',
      'Field Walkdowns',
      'Project Management',
    ],
    logo: '/experience/pseg.png',
  },
  {
    id: 'hfr',
    role: 'Mechanical Design Engineer Intern',
    company: 'Human Friendly Robotics',
    period: 'Mar 2026 — Jun 2026',
    section: 'experience',
    description:
      'Designed the 912 × 728 × 145 mm chassis base in Autodesk Fusion for Tyler, a 50 lb autonomous floor-tiling robot, sizing it for standard doorways, center of mass, and wheel clearance. Engineered interchangeable end-effectors (a three-pad vacuum gripper on Hitec HLS12 linear servos for LVT and VCT, and a hook-and-loop pad for 305 × 305 mm carpet tile) with a quick-release tool-change interface balanced by moments to hold a ±1mm placement spec, replacing 8 screws with 2 latches. Split the PETG side panel to fit the build volume and speed service. Tyler is deployed at Plaza Las Américas, Puerto Rico, installing flooring at 100 sq ft/hr, and the panel design allowed an on-site wire repair during deployment.',
    techStack: ['Autodesk Fusion', 'SolidWorks', 'GD&T', 'Tolerance Analysis', 'Servo Mechanisms'],
    logo: '/experience/hfr.png',
  },
  {
    id: 'baja',
    role: 'Vehicle Systems Engineer',
    company: 'Baja SAE at NJIT (Highlander Racing)',
    period: 'Sep 2025 — May 2026',
    section: 'experience',
    description:
      'Performed finite element analysis (FEA) across 12+ design iterations evaluating roll-cage performance under 15g front, 10g side, and 8g rear impacts — achieving a 12% weight reduction at a 1.5× factor of safety. Separately ran static FEA on the 4130 steel frame and suspension tabs, cutting 3.6 lb (4.35%) and converging tab designs toward a 1.2 factor of safety, correlated with load-rig testing. Laser-cut tubing on a fiber laser and TIG-welded suspension and mounting tabs onto the 2026 car, which completed a 4-hour mock endurance race with no critical failures for the first time in 5 years.',
    techStack: ['SolidWorks', 'FEA Simulation', 'TIG Welding', 'Laser Cutting'],
    logo: '/experience/baja.png',
  },
  {
    id: 'pseg-public-affairs',
    role: 'Business Intern',
    company: 'PSEG (Public Service Enterprise Group)',
    period: 'May 2025 — Aug 2025',
    section: 'experience',
    description:
      'On the Regional Public Affairs team, built and deployed a stakeholder-tracking dashboard consolidating municipal outreach across 185 municipalities — adopted by Public Affairs to coordinate infrastructure permitting for a utility serving 2.4M electric and 1.9M gas customers. Created communications materials and conducted research on key policy issues.',
    techStack: ['Community Outreach', 'Research', 'Communication'],
    logo: '/experience/pseg.png',
  },

  // ── Leadership ──────────────────────────────────────────────────────────
  {
    id: 'mlt',
    role: 'CareerPrep Fellow — Software Engineering Track',
    company: 'Management Leadership for Tomorrow (MLT)',
    period: 'Dec 2025 — Present',
    section: 'leadership',
    description:
      'Selected for a competitive 20-month national fellowship preparing high-potential technologists through technical interview prep, system design training, and mentorship from industry engineers, with intensive case preparation and personalized coaching.',
    techStack: ['Leadership', 'System Design', 'Career Readiness'],
    logo: '/experience/mlt.png',
  },
  {
    id: 'shpe-ivp',
    role: 'Internal Vice President',
    company: 'Society of Hispanic Professional Engineers (SHPE) at NJIT',
    period: 'May 2026 — Present',
    section: 'leadership',
    description:
      "Lead internal chapter operations for NJIT's largest engineering organization — coordinating the executive board, internal communications, and member engagement while mentoring members across the chapter's engineering team. Secured $40,000+ in operating funding through a targeted outreach campaign, building partnerships with Deans, Department Chairs, and Executive Cabinets to support 410+ active students and alumni.",
    techStack: ['Leadership', 'Fundraising', 'Chapter Operations', 'Mentorship'],
    logo: '/experience/shpe.png',
  },
  {
    id: 'shpe-webmaster',
    role: 'Webmaster',
    company: 'Society of Hispanic Professional Engineers (SHPE) at NJIT',
    period: 'Sep 2025 — May 2026',
    section: 'leadership',
    description:
      "Managed the chapter's digital infrastructure and led a 5-member engineering team — establishing version control, pull requests, and CI/CD workflows while mentoring members in modern software development. Shipped the chapter's mobile app in 27 days — SHPE's highest-rated app nationally, reaching 250 members in its first month and now live on the Apple App Store and Google Play.",
    techStack: ['React Native', 'Supabase', 'Next.js', 'Tailwind CSS'],
    logo: '/experience/shpe.png',
  },
  {
    id: 'reslife-ra',
    role: 'Resident Assistant',
    company: 'NJIT Residence Life (Cypress Hall)',
    period: 'Aug 2026 — Present',
    section: 'leadership',
    description:
      'Support a residence-hall community as a live-in student staff member — building resident relationships, running overnight on-call duty with rounds, responding to and escalating incidents through established protocols, and documenting each one.',
    techStack: ['Community Building', 'Crisis Response', 'Documentation'],
  },
  {
    id: 'firstgenu',
    role: 'FirstGenU Fellow w/ Morgan Stanley IFI',
    company: 'America Needs You',
    period: 'Sep 2025 — Nov 2025',
    section: 'leadership',
    description:
      'Selected for a national program supporting first-generation college students. Completed structured training in professional communication, project management, emotional intelligence, and job search strategies.',
    techStack: ['Project Management', 'Networking', 'Coaching'],
    logo: '/experience/america-needs-you.png',
  },
  {
    id: 'team',
    role: 'Outreach Coordinator',
    company: 'NJIT T.E.A.M.',
    period: 'Jan 2025 — Present',
    section: 'leadership',
    description:
      'Organize and facilitate workshops on study skills, time management, and professional development. Support underrepresented and high-need student populations, including Pell-eligible and first-generation college students.',
    techStack: ['Public Outreach', 'Mentorship', 'Advertising'],
    logo: '/experience/team.png',
  },
  {
    id: 'senate',
    role: 'Internal/External Affairs - Student at Large',
    company: 'NJIT Student Senate',
    period: 'Oct 2025 — Feb 2026',
    section: 'leadership',
    description:
      'Collaborated with local community organizations to foster partnerships. Coordinated service opportunities and managed disciplinary issues within the Senate, overseeing impeachment hearings and upholding student governance.',
    techStack: ['Public Relations', 'Policy Interpretation', 'Leadership'],
    logo: '/experience/senate.png',
  },
  {
    id: 'nj-gov',
    role: 'New Jersey Governor’s Fellow',
    company: 'State of New Jersey',
    period: 'May 2025 — Aug 2025',
    section: 'leadership',
    description:
      'Led a 6-member team in an 8-week CHPRD NJ Fellows Project to develop a strategic plan adopted by HISPA. Gained hands-on experience in public service collaborating with industry leaders and public officials.',
    techStack: ['Public Service', 'Strategic Planning', 'Leadership'],
    logo: '/experience/new-jersey.png',
  },
];
