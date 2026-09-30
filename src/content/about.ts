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
    '/social/shpe-eboard-meeting.jpg',
    '/jossue/headshot.jpg',
    '/jossue/crossed-headshots.jpg',
    '/jossue/hands-headshot.jpg',
    '/social/jossue-accord-photo-together.jpg',
    '/social/jossue-accord-photo.jpg',
  ],
  bio: 'From harvesting limes in Ecuador at eleven to presenting research at Yongfeng High School in Taiwan at seventeen, my path has been defined by drastically different environments. It is in navigating these distinct languages, cultures and communities where I learned a core truth of engineering: no system is truly efficient unless it is designed for the people who actually depend on it. As the first in my family to go to college, I am proud to pursue a Bachelor of Science in Mechanical Engineering with a minor in Electrical Engineering. I consider myself privileged for the opportunity to be in a place many others would trade anything to be in. My passion for engineering is rooted in being a car-loving teenager who struggled to afford repairs and enhancements. It is in these late nights chasing a 10mm, heating a seized bolt, or spinning a washer with two fingers that I learned the value of persistence and power tools. My career has taken me across many fields, from state government, to software development, to entrepreneurship, to project management, and most recently startup robotics. I am proud of my Salvadoran and Ecuadorian heritage and I am grateful for every opportunity I get to smile and contribute my piece to the world.',
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
    { label: 'Roles', value: '13' },
    { label: 'Projects', value: '10' },
  ],
  currently: [
    'Program Lead @ NJIT Career Services',
    'Internal VP @ SHPE NJIT',
    'MLT CareerPrep Fellow',
    'BS Mechanical Engineering @ NJIT',
  ],
};
