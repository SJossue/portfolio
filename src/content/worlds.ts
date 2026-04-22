export interface WorldHighlight {
  title: string;
  tech: string;
}

export interface WorldData {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  color: string;
  colorRgb: string;
  auroraColors: [string, string, string];
  particleColors: string[];
  stats: { label: string; value: number }[];
  highlights: WorldHighlight[];
  moreCount: number;
}

export const worlds: WorldData[] = [
  {
    id: 'garage',
    slug: '/garage',
    name: 'MY GARAGE',
    subtitle: 'Projects & Craft',
    description:
      'Where ideas become real. Projects, tools, and the craft of building things that work.',
    color: '#f97316',
    colorRgb: '249, 115, 22',
    auroraColors: ['#f97316', '#fb923c', '#ea580c'],
    particleColors: ['#f97316', '#fb923c', '#ffffff'],
    stats: [
      { label: 'Projects', value: 6 },
      { label: 'Tools', value: 12 },
    ],
    highlights: [
      { title: 'DataCool: AI Optimization', tech: 'Python · scikit-learn · Streamlit' },
      { title: 'SHPE Mobile App', tech: 'React Native · TypeScript · UI/UX' },
      { title: 'Baja Chassis FEA', tech: 'SolidWorks · FEA · Vehicle Dynamics' },
    ],
    moreCount: 3,
  },
  {
    id: 'barber',
    slug: '/barber',
    name: 'MY TIMELINE',
    subtitle: 'Experience',
    description: 'A journey through the roles, milestones, and moments that shaped the path.',
    color: '#8b5cf6',
    colorRgb: '139, 92, 246',
    auroraColors: ['#8b5cf6', '#a78bfa', '#7c3aed'],
    particleColors: ['#8b5cf6', '#a78bfa', '#ffffff'],
    stats: [
      { label: 'Roles', value: 8 },
      { label: 'Years', value: 2 },
    ],
    highlights: [
      { title: 'MLT Tech Prep Fellow', tech: 'Leadership · Career Readiness' },
      { title: "NJ Governor's Fellow", tech: 'Public Service · Strategy' },
      { title: 'PSEG Public Affairs', tech: 'Outreach · Communication' },
    ],
    moreCount: 5,
  },
  {
    id: 'student',
    slug: '/student',
    name: 'THE STUDENT',
    subtitle: 'Research & Education',
    description: 'The grind, the curiosity, the academic side. Late nights and breakthroughs.',
    color: '#06b6d4',
    colorRgb: '6, 182, 212',
    auroraColors: ['#06b6d4', '#22d3ee', '#0891b2'],
    particleColors: ['#06b6d4', '#22d3ee', '#ffffff'],
    stats: [
      { label: 'Papers', value: 3 },
      { label: 'Topics', value: 5 },
    ],
    highlights: [
      { title: 'AV Ethics Research', tech: 'Autonomous Systems · Ethics' },
      { title: 'Mechanical Engineering', tech: 'NJIT · BS + EE Minor' },
      { title: 'AI & Path Planning', tech: 'Python · A* · Automation' },
    ],
    moreCount: 2,
  },
  {
    id: 'real-me',
    slug: '/real-me',
    name: 'ABOUT ME',
    subtitle: 'About & Contact',
    description: 'The human behind the code. Connect, chat, and get to know the real me.',
    color: '#10b981',
    colorRgb: '16, 185, 129',
    auroraColors: ['#10b981', '#34d399', '#059669'],
    particleColors: ['#10b981', '#34d399', '#ffffff'],
    stats: [
      { label: 'Skills', value: 16 },
      { label: 'Links', value: 5 },
    ],
    highlights: [
      { title: 'Product Engineer', tech: 'Salvadoran & Ecuadorian' },
      { title: 'Learn by Building', tech: 'Philosophy & Approach' },
      { title: "Let's Connect", tech: 'Chat · Email · LinkedIn' },
    ],
    moreCount: 0,
  },
];
