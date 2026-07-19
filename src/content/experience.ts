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
    id: 'pseg',
    role: 'Project Management Intern',
    company: 'PSEG (Public Service Enterprise Group)',
    period: 'Jun 2026 — Present',
    section: 'experience',
    description:
      'Manage multiple concurrent electrical transmission and distribution capital projects, coordinating procurement, environmental permitting, and budget forecasting for multi-million-dollar substation construction on the Projects & Construction integration team.',
    techStack: ['Project Management', 'Electrical T&D', 'Budget Forecasting'],
    logo: '/experience/pseg.png',
  },
  {
    id: 'hfr',
    role: 'Robotics Engineering Intern',
    company: 'Human Friendly Robotics',
    period: 'Mar 2026 — Jun 2026',
    section: 'experience',
    description:
      'Developed autonomous robots for a construction-tech startup — iterating mechanical assemblies and performing clearance and fit analysis to integrate actuators, sensors, and end-effectors within tight chassis tolerances. Collaborated with engineers on ROS 2 control systems running on NVIDIA Jetson hardware across embedded Linux workflows and real-time sensor–actuator integration.',
    techStack: ['ROS 2', 'NVIDIA Jetson', 'Embedded Linux', 'Mechanical Design'],
    logo: '/experience/hfr.png',
  },
  {
    id: 'baja',
    role: 'Vehicle Systems Engineer',
    company: 'Baja SAE at NJIT (Highlander Racing)',
    period: 'Sep 2025 — May 2026',
    section: 'experience',
    description:
      'Performed finite element analysis (FEA) across 12+ design iterations evaluating roll-cage performance under 15g front, 10g side, and 8g rear impacts — achieving a 12% weight reduction at a 1.5× factor of safety. Fabricated suspension and chassis components via MIG/TIG welding, collaborating with drivetrain and suspension teams to ensure vehicle-level structural integrity.',
    techStack: ['SolidWorks', 'FEA Simulation', 'MIG/TIG Welding', 'Vehicle Dynamics'],
    logo: '/experience/baja.png',
  },
  {
    id: 'pseg-public-affairs',
    role: 'Regional Public Affairs Intern',
    company: 'PSEG (Public Service Enterprise Group)',
    period: 'Jun 2025 — Aug 2025',
    section: 'experience',
    description:
      'Built a stakeholder-tracking dashboard logging municipal outreach, community feedback, and public-affairs activity across the Northern Region — improving visibility and coordination for engineering and regional teams. Created communications materials and conducted research on key policy issues.',
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
      "Lead internal chapter operations for NJIT's largest engineering organization — coordinating the executive board, internal communications, and member engagement while mentoring members across the chapter's engineering team.",
    techStack: ['Leadership', 'Chapter Operations', 'Mentorship'],
    logo: '/experience/shpe.png',
  },
  {
    id: 'shpe-webmaster',
    role: 'Webmaster',
    company: 'Society of Hispanic Professional Engineers (SHPE) at NJIT',
    period: 'Sep 2025 — May 2026',
    section: 'leadership',
    description:
      "Managed the chapter's digital infrastructure and led a 5-member engineering team — establishing version control, pull requests, and CI/CD workflows while mentoring members in modern software development. Shipped the chapter's mobile app in 27 days, now live on the Apple App Store and Google Play.",
    techStack: ['React Native', 'Supabase', 'Next.js', 'Tailwind CSS'],
    logo: '/experience/shpe.png',
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
