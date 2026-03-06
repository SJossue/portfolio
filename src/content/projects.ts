export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'portfolio',
    title: 'Interactive 3D Engineering Portfolio',
    description:
      'A custom-built, full-stack portfolio utilizing React Three Fiber to render a navigable 3D garage environment. Engineered with glassmorphism UI, custom lighting models, and responsive layouts to reflect an intersection of physical and digital design and car culture.',
    techStack: ['Next.js', 'React Three Fiber', 'TypeScript', 'GSAP', 'Tailwind CSS'],
    githubUrl: 'https://github.com/SJossue/portfolio',
  },
  {
    id: 'baja-chassis',
    title: 'Baja SAE Chassis Optimization',
    description:
      'Conducted rigorous finite element analysis (FEA) through 12+ iterations on a Baja SAE roll cage. Optimized geometry to withstand multi-axis high-g impacts while achieving a 12% weight reduction and maintaining a 1.5x safety factor.',
    techStack: ['SolidWorks', 'FEA Simulation', 'Vehicle Dynamics', 'Testing'],
  },
  {
    id: 'shpe-platform',
    title: 'SHPE NJIT Platform Migration',
    description:
      'Engineered a modern, responsive platform for the Society of Hispanic Professional Engineers chapter. Migrated legacy infrastructure to a scalable Next.js framework to improve accessibility, modularity, and maintainability.',
    techStack: ['React', 'Next.js', 'Tailwind CSS', 'JavaScript'],
  },
  {
    id: 'autonomous-nav',
    title: 'Autonomous Vehicle Simulator',
    description:
      'Built a custom autonomous vehicle navigation simulator using Python, implementing A* path planning algorithms and real-time visualization to model intelligent machine movement in constrained environments.',
    techStack: ['Python', 'A* Algorithm', 'Simulation', 'AI Tools'],
  },
];
