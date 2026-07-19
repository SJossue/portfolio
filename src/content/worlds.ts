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
      { label: 'Projects', value: 7 },
      { label: 'Technologies', value: 18 },
    ],
    highlights: [
      { title: 'Forge: AI Embedded Platform', tech: 'React Native · ESP32 · PlatformIO' },
      { title: 'SHPE Mobile App', tech: 'React Native · Supabase · Live on App Store' },
      { title: 'Baja Chassis FEA', tech: 'SolidWorks · FEA · Vehicle Dynamics' },
    ],
    moreCount: 4,
  },
  {
    id: 'timeline',
    slug: '/timeline',
    name: 'MY TIMELINE',
    subtitle: 'Experience',
    description: 'A journey through the roles, milestones, and moments that shaped the path.',
    color: '#8b5cf6',
    colorRgb: '139, 92, 246',
    auroraColors: ['#8b5cf6', '#a78bfa', '#7c3aed'],
    particleColors: ['#8b5cf6', '#a78bfa', '#ffffff'],
    stats: [
      { label: 'Roles', value: 11 },
      { label: 'Organizations', value: 9 },
      { label: 'Current', value: 4 },
      { label: 'Fellowships', value: 3 },
    ],
    highlights: [
      { title: 'Robotics Engineering Intern', tech: 'Human Friendly Robotics · ROS 2 · Jetson' },
      { title: 'PSEG Project Management', tech: 'Electrical T&D · Capital Projects' },
      { title: 'SHPE Internal VP', tech: 'Chapter Ops · Engineering Team' },
    ],
    moreCount: 8,
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
      { label: 'Topics', value: 7 },
      { label: 'Words', value: 6290 },
      { label: 'Cited', value: 36 },
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
      { label: 'Skills', value: 20 },
      { label: 'Focus areas', value: 5 },
      { label: 'Years building', value: 3 },
      { label: 'Ways to connect', value: 5 },
    ],
    highlights: [
      { title: 'Product Engineer', tech: 'Salvadoran & Ecuadorian' },
      { title: 'Learn by Building', tech: 'Philosophy & Approach' },
      { title: "Let's Connect", tech: 'Chat · Email · LinkedIn' },
    ],
    moreCount: 0,
  },
];
