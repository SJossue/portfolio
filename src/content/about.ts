export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Highlight {
  label: string;
  value: string;
}

export interface AboutData {
  name: string;
  roleTitle: string;
  ethnicity: string;
  images: string[];
  bio: string;
  skills: SkillGroup[];
  highlights: Highlight[];
  /** What I'm up to right now — the "Currently" block in the About aside. */
  currently: string[];
}

export const aboutData: AboutData = {
  name: 'Jossue Sarango',
  roleTitle: 'Product Engineer',
  ethnicity: 'Salvadoran & Ecuadorian',
  images: [
    '/jossue/headshot.jpg',
    '/jossue/crossed-headshots.jpg',
    '/jossue/hands-headshot.jpg',
    '/social/jossue-accord-photo-together.jpg',
    '/social/jossue-accord-photo.jpg',
  ],
  bio: 'I build things — physical and digital — and I understand how complex systems come together. I am currently pursuing a Bachelor of Science in Mechanical Engineering with a minor in Electrical Engineering at NJIT. My approach is driven by a "Learn by building" philosophy, rooted in automotive engineering and wrenching on cars, and now pointed squarely at robotics and embedded systems — building autonomous machines on ROS 2 and Jetson hardware. Whether it is a suspension geometry, a robot chassis, a data pipeline, or a web application, the process is the same: break the system down, understand constraints, iterate, and refine until it feels correct.',
  skills: [
    {
      category: 'Mechanical Eng',
      items: ['SolidWorks', 'CAD Modeling', 'FEA Simulation', 'MIG/TIG Welding'],
    },
    {
      category: 'Robotics & Embedded',
      items: ['ROS 2', 'NVIDIA Jetson', 'ESP32', 'Embedded Linux'],
    },
    {
      category: 'Software & Product',
      items: ['TypeScript', 'React', 'Next.js', 'Python', 'Tailwind CSS'],
    },
    {
      category: 'Systems & AI',
      items: ['HW/SW Integration', 'LLM Integration', 'A* Path Planning', 'Automation'],
    },
    {
      category: 'Leadership',
      items: ['Technical Leadership', 'Cross-Functional Collaboration', 'Project Execution'],
    },
  ],
  highlights: [
    { label: 'Philosophy', value: 'Learn by Building' },
    { label: 'Pillars', value: 'Execution, Systems, Leadership' },
    { label: 'Roles', value: '10' },
    { label: 'Projects', value: '7' },
  ],
  currently: [
    'Project Management Intern @ PSEG',
    'Internal VP @ SHPE NJIT',
    'MLT CareerPrep Fellow',
    'BS Mechanical Engineering @ NJIT',
  ],
};
