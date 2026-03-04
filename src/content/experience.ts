export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  techStack: string[];
}

export const experienceData: ExperienceEntry[] = [
  {
    id: 'current',
    role: 'Full-Stack Engineer',
    company: 'Freelance / Contract',
    period: '2024 — Present',
    description:
      'Building performant web applications with React, Next.js, and Node.js. Focus on interactive 3D experiences, accessibility, and clean architecture.',
    techStack: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Node.js'],
  },
  {
    id: 'prev-1',
    role: 'Software Engineer',
    company: 'Production Systems',
    period: '2022 — 2024',
    description:
      'Developed and maintained full-stack applications serving thousands of users. Led migration to modern frontend stack and improved CI/CD pipelines.',
    techStack: ['React', 'Python', 'PostgreSQL', 'Docker', 'AWS'],
  },
  {
    id: 'prev-2',
    role: 'Junior Developer',
    company: 'Web Agency',
    period: '2020 — 2022',
    description:
      'Built responsive web applications and e-commerce platforms for clients. Introduced testing practices and component-driven development.',
    techStack: ['JavaScript', 'React', 'Node.js', 'MySQL', 'Git'],
  },
];
