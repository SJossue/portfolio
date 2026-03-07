export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  heroImage?: string;
  situation?: string;
  task?: string;
  action?: string;
  solution?: string;
  lessons?: string[];
  images?: string[];
}

export const projects: Project[] = [
  {
    id: 'data-cool',
    title: 'DataCool: AI Optimization',
    description:
      'A machine learning system that predicts server hotspots and optimizes workload distribution across data center racks. Built in 4 hours for the Claude NJIT Hackathon (1st Place).',
    techStack: ['Python', 'scikit-learn', 'Streamlit', 'Three.js'],
    githubUrl: 'https://github.com/YRCV/DataCool',
    heroImage: '/projects/data-cool/thermal-visualizer.jpeg',
    situation:
      'Data centers face massive thermal threshold risks, often leading to hardware failure or inefficient localized cooling distributions.',
    task: 'Design a predictive AI constraint-satisfaction algorithm that forecasts rack temperatures and actively generates a workload migration map.',
    action:
      'Integrated a Histogram Gradient Boosting classifier with SHAP interpretability. Developed a custom thermal coupling simulation algorithm to process high-risk rack locations and redistribute computing loads proactively across cooler nodes.',
    solution:
      'Achieved 94% prediction accuracy, reducing critical overheating incidents by 75% in simulation. Won 1st Place at the Claude NJIT Hackathon.',
    lessons: [
      'Constraint satisfaction balancing thermal physics against migration costs.',
      'Integrating SHAP limits black-box decision making in critical path execution.',
    ],
    images: [
      '/projects/data-cool/complete-optimization.jpeg',
      '/projects/data-cool/during-optimization.jpeg',
      '/projects/data-cool/team-brainstorming.jpeg',
      '/projects/data-cool/winners-photo.jpeg',
    ],
  },
  {
    id: 'av-ethics',
    title: 'AV Ethics Research',
    description:
      'Independent research on the intersection of engineering and ethics in autonomous systems, focusing on algorithmic constraints for split-second hazard edge cases.',
    techStack: ['Python', 'Simulation Tools', 'Research'],
    heroImage: '/projects/av-ethics/PythonAVS.jpg',
    situation:
      'Autonomous vehicles must make split-second decisions in hazardous scenarios, but traditional utilitarian approaches face significant ethical challenges in real-world edge cases.',
    task: 'Explore how different philosophical frameworks translate into explicit programmatic constraints for safety architectures.',
    action:
      'Researched existing decision frameworks and mapped literature onto potential algorithm flowcharts to identify gaps in edge case safety responses.',
    solution:
      'Built a core foundation understanding the ethical dependencies wrapped into engineering autonomous response systems, shaping a potential graduate research direction.',
  },
  {
    id: 'shpe-app',
    title: 'SHPE Mobile App',
    description:
      'Designed and developed a cohesive mobile application to augment event accessibility, member interactions, and internal tracking for the SHPE organization.',
    techStack: ['React Native', 'TypeScript', 'UI/UX'],
    heroImage: '/projects/shpe-app/app-landing-page.jpeg',
    situation:
      'Communication between members and the executive board was fractured across multiple discrete platforms (email, external calendars, social media).',
    task: 'Consolidate organizational touchpoints into a unified, accessible mobile application for the student body.',
    action:
      'Prototyped user flows natively encompassing event itineraries, individual rank trackers, and gamified engagement profiles.',
    solution:
      'Designed an elegant interface currently staging for deployment on the Apple App Store, centralizing SHPE activities gracefully.',
    images: [
      '/projects/shpe-app/app-events-page.jpeg',
      '/projects/shpe-app/app-user-rank.jpeg',
      '/projects/shpe-app/3d-shpe-logo.jpeg',
      '/projects/shpe-app/apple-app-store.jpeg',
    ],
  },
  {
    id: 'shpe-web',
    title: 'SHPE Platform & Gala UI',
    description:
      'Engineered a modern, responsive platform and digital gala itinerary for the Society of Hispanic Professional Engineers chapter.',
    techStack: ['React', 'Next.js', 'Tailwind CSS'],
    heroImage: '/projects/shpe-web/gala-home.jpg',
    situation:
      'The legacy chapter website was notoriously hard to update and update structures lacked modern responsiveness.',
    task: 'Migrate to a modern headless architecture utilizing React and Tailwind CSS.',
    action:
      'Rebuilt the organizational frontend with scalable component structures, heavily iterating on custom graphical layouts and e-board design galleries.',
    solution:
      'Successfully deployed a high-performance static platform serving event itineraries and organization records seamlessly.',
    images: [
      '/projects/shpe-web/gala-itinerary-design.jpg',
      '/projects/shpe-web/eboard-design.jpg',
      '/projects/shpe-web/shpetinas.jpeg',
    ],
  },
  {
    id: 'stress-analysis',
    title: 'Baja Chassis FEA',
    description:
      'Conducted rigorous finite element analysis through iterative cycles on a Baja SAE roll cage for maximal structural efficiency.',
    techStack: ['SolidWorks', 'FEA Simulation', 'Vehicle Dynamics'],
    heroImage: '/projects/stress-analysis/stressed-chassis.jpeg',
    situation:
      'Previous multi-axis impact models showed potential over-engineering in low-stress support tubing, artificially increasing curb weight.',
    task: 'Optimize the 4130 steel spaceframe across rigorous simulated load cases to shave weight while verifying SAE minimum safety factors.',
    action:
      'Processed CAD assemblies through iterative mechanical stress models mapping varied torsion, side-impact, and frontal collision conditions.',
    solution:
      'Mapped critical high-stress nodes vs low-stress lengths to dictate the tubing profile alterations ultimately securing the chassis bounds.',
    images: [
      '/projects/stress-analysis/chassis-left-side.jpeg',
      '/projects/stress-analysis/chassis-left-bare.jpeg',
      '/projects/stress-analysis/baja-website.jpeg',
    ],
  },
  {
    id: 'prosthetic',
    title: 'Linear Actuator Hand',
    description:
      'A mechanical engineering project dedicated to designing an accessible, linear actuator driven hand prosthetic system.',
    techStack: ['CAD', 'Robotics', 'Biomechanics'],
    heroImage: '/projects/prosthetic/final-display.jpeg',
    situation:
      'Advanced bionic prosthetics remain financially inaccessible for the vast majority of amputees needing localized articulation.',
    task: 'Draft, sketch, and model a linear actuator driven mechanism capable of grasping actions via simplified linkage arrays.',
    action:
      'Mapped human finger kinematics into exploded CAD views mapping the linkage systems necessary to mimic natural closures via linear pushes.',
    solution:
      'Created detailed mechanical schematics isolating the actuator force transmission vectors effectively.',
    images: [
      '/projects/prosthetic/exploded-cad-view.jpeg',
      '/projects/prosthetic/exploded-sketch.jpeg',
      '/projects/prosthetic/descriptive-sketch.jpeg',
    ],
  },
];
