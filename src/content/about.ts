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
  bio: 'I build things — physical and digital — and I understand how complex systems come together. I am currently pursuing a Bachelor of Science in Mechanical Engineering with a minor in Electrical Engineering at NJIT. My approach is driven by a "Learn by building" philosophy, rooted in automotive engineering and wrenching on cars. Whether it is a suspension geometry, a data pipeline, or a web application, the process is the same: break the system down, understand constraints, iterate, and refine until it feels correct.',
  skills: [
    {
      category: 'Mechanical Eng',
      items: ['SolidWorks', 'CAD Modeling', 'FEA Simulation', 'System Testing'],
    },
    {
      category: 'Software & Product',
      items: ['TypeScript', 'React', 'Next.js', 'Python', 'Tailwind CSS'],
    },
    {
      category: 'Systems & AI',
      items: ['HW/SW Integration', 'Architecture', 'A* Path Planning', 'Automation'],
    },
    {
      category: 'Leadership',
      items: ['Technical Leadership', 'Cross-Functional Collaboration', 'Project Execution'],
    },
  ],
  highlights: [
    { label: 'Identity', value: 'Product-Oriented Systems Engineer' },
    { label: 'Philosophy', value: 'Learn by Building' },
    { label: 'Pillars', value: 'Hardware, Software, UX' },
  ],
};
