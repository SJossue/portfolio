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
  roleTitle: 'Mechanical Design Engineer',
  ethnicity: 'Salvadoran & Ecuadorian',
  images: [
    '/jossue/headshot.jpg',
    '/jossue/crossed-headshots.jpg',
    '/jossue/hands-headshot.jpg',
    '/social/jossue-accord-photo-together.jpg',
    '/social/jossue-accord-photo.jpg',
  ],
  bio: 'I design and build physical mechanisms, not diagrams of them. I am pursuing a Bachelor of Science in Mechanical Engineering with a minor in Electrical Engineering at NJIT. My "learn by building" philosophy started under the hood of my own car and now drives every mechanism I take from CAD to a working part: a suction end-effector and servo-actuated tilt mechanism on a 50 lb autonomous tiling robot deployed in Puerto Rico, a Baja SAE roll cage cut 12% lighter at a 1.5x factor of safety, and a tendon-driven prosthetic hand. Two internships inside a regulated utility also gave me exposure most mechanical engineering juniors do not get: substation drawing audits, field walkdowns, and a $60M+ capital project portfolio. I still build software on the side (this site is one example), but the work I am chasing next is CAD, GD&T, tolerance stack-ups, and DFMEA on real hardware, on the way to eventually founding a hardware company of my own.',
  skills: [
    {
      category: 'CAD & Analysis',
      items: ['SolidWorks', 'Fusion 360', 'GD&T', 'Tolerance Stack-Up', 'FEA Simulation'],
    },
    {
      category: 'Manufacturing',
      items: [
        'TIG/MIG Welding',
        'Rapid Prototyping',
        'SAE Compliance',
        'Fault Tree Analysis',
        'DFMEA',
      ],
    },
    {
      category: 'Programming',
      items: ['Python', 'TypeScript/React', 'MATLAB', 'SQL', 'Git'],
    },
    {
      category: 'Robotics & Controls',
      items: ['ROS 2', 'NVIDIA Jetson', 'LiDAR', 'Servos & Actuators', 'Microcontrollers'],
    },
    {
      category: 'Leadership',
      items: ['Technical Leadership', 'Cross-Functional Collaboration', 'Project Execution'],
    },
  ],
  highlights: [
    { label: 'Philosophy', value: 'Learn by Building' },
    { label: 'Pillars', value: 'Design, Execution, Leadership' },
    { label: 'Roles', value: '12' },
    { label: 'Projects', value: '10' },
  ],
  currently: [
    'Program Assistant @ NJIT Career Services',
    'Internal VP @ SHPE NJIT',
    'MLT CareerPrep Fellow',
    'BS Mechanical Engineering @ NJIT',
  ],
};
