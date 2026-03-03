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
    title: 'Interactive 3D Portfolio',
    description:
      'A cyberpunk-themed portfolio built with React Three Fiber, featuring a navigable 3D garage environment with neon lighting, reflective floors, and interactive objects.',
    techStack: ['Next.js', 'React Three Fiber', 'TypeScript', 'GSAP', 'Tailwind CSS'],
    githubUrl: 'https://github.com/SJossue/portfolio',
  },
  {
    id: 'placeholder-cli',
    title: 'CLI Task Runner',
    description:
      'A modular command-line tool for orchestrating development workflows with parallel task execution, dependency graphs, and live progress reporting.',
    techStack: ['Node.js', 'TypeScript', 'Commander.js'],
    githubUrl: '#',
  },
  {
    id: 'placeholder-api',
    title: 'Real-time Event Platform',
    description:
      'A full-stack event management platform with WebSocket-powered live updates, role-based access control, and a responsive dashboard.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'WebSocket', 'Docker'],
    githubUrl: '#',
    liveUrl: '#',
  },
  {
    id: 'placeholder-ml',
    title: 'Data Pipeline Engine',
    description:
      'An ETL pipeline framework for processing and transforming large datasets with configurable stages, validation rules, and monitoring dashboards.',
    techStack: ['Python', 'Apache Kafka', 'Redis', 'Grafana'],
    githubUrl: '#',
  },
];
