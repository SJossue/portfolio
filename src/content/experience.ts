export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  techStack: string[];
  achievements?: string[];
  images?: string[];
  logo?: string;
}

export const experienceData: ExperienceEntry[] = [
  {
    id: 'mlt',
    role: 'Tech Prep Fellow',
    company: 'Management Leadership for Tomorrow',
    period: 'Dec 2025 — Present',
    description:
      'Highly competitive 20-month fellowship focused on leadership development in the technology track, with intensive case preparation, industry-focused bootcamps, and personalized coaching to strengthen communication and professional career readiness.',
    techStack: ['Leadership', 'Communication', 'Career Readiness'],
  },
  {
    id: 'baja',
    role: 'Chassis Design & Testing Engineer',
    company: 'NJIT Highlander Racing (Baja SAE)',
    period: 'Sep 2025 — Present',
    description:
      'Performed finite element analysis (FEA) through 12+ design iterations to evaluate roll cage performance under 15g front, 10g side, and 8g rear impacts. Identified stress concentrations and achieved a 12% weight reduction with a 1.5× safety factor.',
    techStack: ['SolidWorks', 'FEA Simulation', 'Mechanical Design'],
  },
  {
    id: 'shpe',
    role: 'VP of Tech / Webmaster',
    company: 'SHPE NJIT Region 4',
    period: 'Sep 2024 — Present',
    description:
      "Spearheaded the official migration of the chapter's public-facing website from legacy technology to a modern, scalable React framework utilizing Next.js and Tailwind CSS. Managed core technological infrastructure including Discord and Google Drive.",
    techStack: ['JavaScript', 'React', 'Next.js', 'Tailwind CSS'],
  },
  {
    id: 'team',
    role: 'Outreach Coordinator',
    company: 'NJIT T.E.A.M.',
    period: 'Jan 2025 — Present',
    description:
      'Organize and facilitate workshops on study skills, time management, and professional development. Support underrepresented and high-need student populations, including Pell-eligible and first-generation college students.',
    techStack: ['Public Outreach', 'Mentorship', 'Advertising'],
  },
  {
    id: 'senate',
    role: 'Internal/External Affairs - Student at Large',
    company: 'NJIT Student Senate',
    period: 'Oct 2025 — Feb 2026',
    description:
      'Collaborated with local community organizations to foster partnerships. Coordinated service opportunities and managed disciplinary issues within the Senate, overseeing impeachment hearings and upholding student governance.',
    techStack: ['Public Relations', 'Policy Interpretation', 'Leadership'],
  },
  {
    id: 'firstgenu',
    role: 'FirstGenU Fellow w/ Morgan Stanley IFI',
    company: 'America Needs You',
    period: 'Sep 2025 — Nov 2025',
    description:
      'Selected for a national program supporting first-generation college students. Completed structured training in professional communication, project management, emotional intelligence, and job search strategies.',
    techStack: ['Project Management', 'Networking', 'Coaching'],
  },
  {
    id: 'pseg',
    role: 'Regional Public Affairs Intern',
    company: 'PSEG',
    period: 'Jun 2025 — Aug 2025',
    description:
      'Supported the Northern Region Public Affairs team by assisting with community outreach, stakeholder engagement, and event coordination. Created communications materials and conducted research on key policy issues.',
    techStack: ['Community Outreach', 'Research', 'Communication'],
  },
  {
    id: 'nj-gov',
    role: 'New Jersey Governor’s Fellow',
    company: 'State of New Jersey',
    period: 'May 2025 — Aug 2025',
    description:
      'Led a 6-member team in an 8-week CHPRD NJ Fellows Project to develop a strategic plan adopted by HISPA. Gained hands-on experience in public service collaborating with industry leaders and public officials.',
    techStack: ['Public Service', 'Strategic Planning', 'Leadership'],
  },
];
