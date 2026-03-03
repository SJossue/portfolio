export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Highlight {
  label: string;
  value: string;
}

export interface AboutData {
  bio: string;
  skills: SkillGroup[];
  highlights: Highlight[];
}

export const aboutData: AboutData = {
  bio: 'Software engineer focused on building performant, accessible web applications. I enjoy working across the stack — from interactive 3D frontends to scalable backend systems. I care about clean architecture, developer experience, and shipping products that people love to use.',
  skills: [
    {
      category: 'Frontend',
      items: ['React', 'Next.js', 'TypeScript', 'Three.js', 'Tailwind CSS'],
    },
    {
      category: 'Backend',
      items: ['Node.js', 'Python', 'PostgreSQL', 'Redis', 'REST/GraphQL'],
    },
    {
      category: 'DevOps',
      items: ['Docker', 'CI/CD', 'AWS', 'Linux', 'Git'],
    },
    {
      category: 'Practices',
      items: ['TDD', 'Agile', 'Code Review', 'System Design', 'A11y'],
    },
  ],
  highlights: [
    { label: 'Focus', value: 'Full-Stack Web' },
    { label: 'Experience', value: 'Production Systems' },
    { label: 'Approach', value: 'Ship & Iterate' },
  ],
};
