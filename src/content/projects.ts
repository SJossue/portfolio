export interface Project {
  id: string;
  title: string;
  /** Short label for the left-panel project nav (defaults to the title before ':'). */
  navLabel?: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  /** Repo is private — shown in the panel with a lock, not clickable. */
  githubPrivate?: boolean;
  /** Additional labeled source links (e.g. separate app + presentation repos). */
  repos?: { label: string; url: string }[];
  /** Extra external links (e.g. a demo video, a Devpost page). */
  links?: { label: string; url: string }[];
  /** Links this build to a hackathon in `hackathons.ts` (shown as a hero on the
   *  left panel). Use for events that also appear in the hub's hero rotation. */
  hackathonId?: string;
  /** A project-only hackathon hero (not in the hub rotation). Same visual as
   *  `hackathonId`, but self-contained to this project. `award` (e.g. "1st
   *  Place") is emphasized as a badge over the photo. */
  hackathon?: { name: string; location: string; image: string; award?: string };
  /** A non-hackathon left-panel banner (org/event photo + label + location). */
  banner?: { name: string; location: string; image: string };
  liveUrl?: string;
  /** Google Play listing URL. */
  playUrl?: string;
  heroImage?: string;
  /** CSS object-position for the center hero image (default centered). */
  heroPosition?: string;
  /** A supporting document (e.g. a design report PDF), shown as a preview card
   *  that opens the file. `cover` is a rendered first-page thumbnail. */
  report?: { url: string; label?: string; pages?: number; cover?: string };
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
    title: 'DataCool: Data Center Optimization',
    navLabel: 'DataCool - Claude Hackathon',
    description:
      'A machine learning system that predicts server hotspots and redistributes workloads across data center racks before they overheat — 94% prediction accuracy with a 75% drop in critical incidents. Built in 4 hours at the Claude NJIT Hackathon (1st Place).',
    techStack: ['Python', 'scikit-learn', 'SHAP', 'Streamlit', 'Three.js'],
    githubUrl: 'https://github.com/GurmeherSingh/DataCool',
    hackathon: {
      name: 'Claude NJIT Hackathon',
      location: 'Newark, NJ',
      image: '/projects/data-cool/winners-photo.jpeg',
      award: '1st Place',
    },
    heroImage: '/projects/data-cool/team-brainstorming.jpeg',
    situation:
      'Data-center cooling is mostly reactive — static thresholds and manual intervention — so thermal spikes surface as hardware failure or wasted, over-provisioned cooling instead of being prevented.',
    task: 'Predict which racks will overheat before they do, then automatically generate a workload-migration plan that respects thermal physics, migration cost, and capacity limits.',
    action:
      'Trained a Histogram Gradient Boosting classifier with SHAP interpretability for per-rack risk scoring, then paired it with a constraint-satisfaction optimizer and a thermal-coupling simulation that models heat between adjacent racks — sorting high-risk racks, finding cool receivers, and costing each transfer by CPU load × distance. Surfaced it all in a Streamlit dashboard with interactive 3D/2D heatmaps and before/after comparison.',
    solution:
      'Hit 94% prediction accuracy and cut hotspots 4 → 1 (75%), dropping peak rack temperature from 78.3°C to 71.2°C in simulation — 1st place at the Claude NJIT Hackathon 2025. Built in 4 hours with Yahil, Guru, and Sergio.',
    lessons: [
      'Constraint satisfaction is a balancing act — thermal physics pulls against migration cost and capacity, and the optimizer is only as good as how you price the tradeoff.',
      'SHAP kept the model out of black-box territory; on a critical path, an explainable 94% beats an opaque 96%.',
    ],
    images: [
      '/projects/data-cool/thermal-visualizer.jpeg',
      '/projects/data-cool/during-optimization.jpeg',
      '/projects/data-cool/complete-optimization.jpeg',
    ],
  },
  {
    id: 'forge',
    title: 'Forge: AI Embedded Platform',
    navLabel: 'Forge - CMU TartanHacks',
    description:
      'AI-powered embedded development from your phone — describe a device in plain language and Forge generates hardware-aware firmware, compiles it in the cloud, and flashes your ESP32 over the air. No laptop, no USB. Built at TartanHacks 2026 (CMU).',
    techStack: ['React Native', 'ESP32', 'PlatformIO', 'Dedalus AI', 'REST APIs'],
    repos: [
      { label: 'App & Firmware', url: 'https://github.com/YRCV/cmu_tartanhacks26' },
      { label: 'Presentation', url: 'https://github.com/SJossue/tartanhacks-present' },
    ],
    hackathonId: 'cmu',
    heroImage: '/projects/forge/forge-hero.jpg',
    situation:
      'Getting started with hardware is gated behind desktop IDEs, USB-tethered flashing, and knowing C/C++, pin maps, and datasheets — a wall that stops most people before their first blink.',
    task: 'Collapse the entire embedded workflow onto a phone: let anyone describe device behavior in plain language and have working firmware land on real hardware, wirelessly.',
    action:
      'Built a React Native (Expo) app that sends intent to Dedalus Labs AI agents, which generate hardware-aware Arduino code and validate it. A cloud service compiles the firmware with the PlatformIO CLI and pushes it to the ESP32 over the air via ArduinoOTA, then the app auto-generates a control GUI — sliders, toggles, and live indicators — from the components in the request.',
    solution:
      'A working mobile-first platform demoed at TartanHacks 2026 (CMU): speak or type "add a servo on pin 9 that sweeps," and ~15 seconds later the board is running it — no IDE, no cable. Built with Yahil and Eren.',
    lessons: [
      'Cloud-compiling for constrained hardware means treating the toolchain itself as a service — the phone never touches a compiler.',
      'OTA safety (verification, an offline-during-flash state, auto-restart) matters as much as the code generation; a bad flash can brick the only device in the room.',
      'Auto-generating the control UI from the detected components is what makes it feel finished — the generated code is only half the product.',
    ],
    images: [
      '/projects/forge/ai1.jpeg',
      '/projects/forge/code1.jpeg',
      '/projects/forge/config1.jpeg',
    ],
  },
  {
    id: 'reunion',
    title: 'Reunion: Group Travel Agent',
    navLabel: 'Reunion - AWS Agentic AI',
    description:
      "A messaging-native travel planning agent that lives in the group chat — it detects when a trip is forming, remembers each person's constraints, and turns casual chatter into concrete coordination: polls, itineraries, and a next step. Built at the Agentic AI Hackathon (SF).",
    techStack: ['TypeScript', 'RocketRide', 'XTrace', 'Butterbase', 'Neo4j', 'iMessage'],
    githubUrl: 'https://github.com/pleyva2004/Reunion',
    hackathon: {
      name: 'AWS Agentic AI Hackathon',
      location: 'San Francisco, CA',
      image: '/hackathons/aws-hackathon.jpeg',
    },
    heroImage: '/projects/reunion/imessage.jpg',
    situation:
      'Friend groups plan trips in the group chat, but the planning state — who is in, what dates, dietary needs, budget — scatters across dozens of messages. Momentum dies, and someone ends up manually chasing everyone. Most travel tools assume a solo search session; the real problem is group coordination.',
    task: "Build an agent that stays inside iMessage, notices when a trip is forming, remembers each person's constraints, and proposes the next concrete coordination step — a single visible loop wiring five sponsor tools end to end.",
    action:
      "Wrote a TypeScript spine — message → on-device gate → extract → route → plan → next action → reply. A cheap local gate wakes only on travel intent so normal chatter never hits the cloud. RocketRide extracts destination, dates, constraints, and preferences; XTrace holds durable per-person and group memory with belief revision (a newer fact supersedes a stale one); Butterbase stores trips, participants, polls, and plan state; and a Neo4j culture graph maps each friend's heritage to food and destination picks. Photon / Spectrum carry it over iMessage. Every layer degrades to an in-memory stub, so the team could build different pieces in parallel and still run the whole loop on day one.",
    solution:
      'A working end-to-end agent demoed at the Agentic AI Hackathon in San Francisco: drop "we should go to Mexico City in July" into the chat and Reunion extracts the trip, folds in each person\'s constraints (weekends-only, vegetarian), and posts back a dated itinerary — then revises its memory when someone changes their availability. Built with Pablo, Kevin, and Ethan.',
    lessons: [
      'A cheap on-device gate before any cloud call is what makes an always-listening chat agent usable — it wakes on intent instead of reacting to every message.',
      'Separating durable memory (XTrace) from application state (Butterbase) kept "what we believe about people" from tangling with "the current trip record" — and made belief revision a first-class feature.',
      'Stubbing every external tool behind one interface let the team build separate layers in parallel and still demo the full loop from day one.',
    ],
    images: [
      '/projects/reunion/hackathon-cover.jpg',
      '/projects/reunion/pipeline.jpg',
      '/projects/reunion/terminal.jpg',
    ],
  },
  {
    id: 'prosthetic',
    title: 'Linear Actuator Hand',
    description:
      'A low-cost (~$100), 3D-printed hand prosthetic driven by a single linear actuator — fishing-line tendons pull the fingers into a fist so the wearer can grip and carry everyday objects. FED 101 design project in NJIT Mechanical & Industrial Engineering.',
    techStack: ['SolidWorks', '3D Printing', 'PLA', 'Linear Actuator'],
    banner: {
      name: 'Department of Mechanical & Industrial Engineering',
      location: 'New Jersey Institute of Technology',
      image: '/projects/prosthetic/angle-view.png',
    },
    heroImage: '/projects/prosthetic/final-display.jpeg',
    report: {
      url: '/projects/prosthetic/linear-actuator-driven-hand-prosthetic.pdf',
      label: 'Design Report',
      pages: 27,
      cover: '/projects/prosthetic/report-cover.jpg',
    },
    situation:
      'Advanced hand prosthetics are expensive and often unreliable, putting a functional grip out of reach for many amputees and people with congenital limb differences who just need to grab and carry everyday objects.',
    task: 'Design and build a working hand prosthetic for under ~$120 that a single linear actuator can drive into a fist, replicating a natural grip — the term project for FED 101, Fundamentals of Engineering Design.',
    action:
      "Modeled the palm, metacarpals, phalanges, and forearm/elbow cuff in SolidWorks and 3D-printed them in PLA at NJIT's Makerspace. Routed fishing-line tendons through the fingers to a forearm-mounted linear actuator (12V power bank + rocker switch) so one actuator stroke contracts every finger into a fist, with rubber bands acting as return springs. Fasteners were chosen per joint by load — custom PLA pins at the light finger joints, wooden dowels and metal hardware where the palm carries the actuator.",
    solution:
      'A functioning tendon-driven prosthetic (~$100 in parts) that closes into a fist to grip and carry objects. Iterated straight from testing: rounded the finger slots to unlock full range of motion, and dropped the separate forearm — repurposing the elbow cuff — to cut weight. Built with Krishna, Lucas, and Erick.',
    lessons: [
      'Where the load goes decides the fastener — printed pins for the light finger joints, wooden dowels and metal hardware where the palm carries the actuator and forearm.',
      'Geometry is function: a rectangular finger slot quietly capped the range of motion until it was rounded — the small CAD details make or break the mechanism.',
      'Removing a whole part (the forearm) did more for usability than any material tweak — simplify before you optimize.',
    ],
    images: [
      '/projects/prosthetic/exploded-cad-view.jpeg',
      '/projects/prosthetic/exploded-sketch.jpeg',
      '/projects/prosthetic/descriptive-sketch.jpeg',
    ],
  },
  {
    id: 'shpe-app',
    title: 'SHPE Mobile App',
    description:
      "SHPE NJIT's official mobile app — the first student-built app in NJIT history, shipped in 27 days and now live on the App Store (5.0★) and Google Play. A cross-platform hub for events, QR check-in, a social feed, and a seasonal points leaderboard.",
    techStack: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'PostgreSQL'],
    githubUrl: 'https://github.com/njitshpe/shpe-app',
    githubPrivate: true,
    liveUrl: 'https://apps.apple.com/us/app/shpe-njit/id6757627370',
    playUrl: 'https://play.google.com/store/apps/details?id=com.shpenjit.officialapp&hl=en_US',
    banner: {
      name: 'Society of Hispanic Professional Engineers',
      location: 'New Jersey Institute of Technology',
      image: '/social/shpe-convention.png',
    },
    heroImage: '/projects/shpe-app/apple-app-store.png',
    heroPosition: 'top',
    situation:
      'The chapter ran on a patchwork — email blasts, a shared calendar, GroupMe, Instagram — so events got missed, involvement was invisible, and there was no single place members actually opened.',
    task: 'Ship one app the chapter lives in: events and RSVP, QR attendance check-in, a moderated social feed, and a points system that makes involvement visible — for members, alumni, and guests alike.',
    action:
      'Built a cross-platform Expo / React Native app (TypeScript, Expo Router) on a Supabase backend — PostgreSQL with row-level security and Deno edge functions for admin actions, QR check-in tokens, and account deletion. Layered in a moderated social feed (blocking + reporting), a seasonal points leaderboard, committee pages, role-based admin dashboards, push notifications, Sign in with Apple, and multi-step onboarding for students, alumni, and guests. A Cloudflare Worker serves branded event-share links off events.shpenjit.org.',
    solution:
      "Live as SHPE NJIT on the App Store (5.0★, Education) and Google Play — the chapter's daily hub for events, check-in, and recognition, and the first student-built app in NJIT history.",
    images: [
      '/projects/shpe-app/app-landing-page.jpeg',
      '/projects/shpe-app/app-events-page.jpeg',
      '/projects/shpe-app/app-user-rank.jpeg',
    ],
  },
  {
    id: 'recall',
    title: 'Recall: Ambient Memory',
    navLabel: 'Recall - HackPrinceton',
    description:
      'A privacy-first ambient memory companion — a tiger that sits on a shelf, watches the room, and remembers events (not video). Ask it what happened in plain English. Built at HackPrinceton 2026.',
    techStack: ['Python', 'FastAPI', 'YOLOv8', 'Raspberry Pi', 'Next.js', 'Three.js'],
    githubUrl: 'https://github.com/SJossue/hackprinceton',
    links: [
      { label: 'Demo Video', url: 'https://www.youtube.com/watch?v=G01OBUhdJ_A' },
      { label: 'Devpost', url: 'https://devpost.com/software/recall-7oecuy' },
    ],
    hackathon: {
      name: 'HackPrinceton',
      location: 'Princeton, NJ',
      image: '/hackathons/princeton-hackathon.jpeg',
    },
    heroImage: '/projects/recall/dashboard.jpg',
    heroPosition: 'top',
    images: ['/projects/recall/floorplan.jpg', '/projects/recall/ambient.jpg'],
    situation:
      'Rooms forget. Where did I leave my keys? Did I take my meds? — the space saw all of it, but nobody can ask it. An always-on camera could answer, but no one wants their living room streamed to the cloud.',
    task: 'Build an ambient device that remembers what happens in a room and answers questions about it in plain English — without ever recording or transmitting video.',
    action:
      "Housed a Raspberry Pi 4 and camera in a tiger that streams frames only over the LAN. A laptop runs YOLOv8 + ByteTrack to reduce the stream to structured events ('bottle placed on the desk in the Living Room') in SQLite. A FastAPI backend feeds recent events to K2 Think V2 (Claude Opus as failover) to answer questions, speaks answers via ElevenLabs, and drives two surfaces — a Next.js editorial dashboard and a phone-stand ambient display whose Three.js particle cloud morphs through idle → listening → thinking → answer. Video never leaves the tiger; only short text events cross any wire.",
    solution:
      "A working privacy-first memory companion demoed at HackPrinceton 2026 — ask 'did I take my meds?' and it answers from what it actually saw, with a proactive agent that drafts (never sends) a caregiver text when a scheduled med is missed. Built with Sunghoo, Ariji, and Jeeyan across the CV, hardware, and frontend.",
    lessons: [
      'Reducing video to text events at the edge is what makes the whole thing private and shippable — the LLM reasons over kilobytes of structured logs, not pixels.',
      'A dual-LLM path (K2 primary, Claude failover, safe fallback) kept the demo answering even when a provider hiccupped — reliability is a feature under stage lights.',
      'The ambient display sold the idea as much as the pipeline did — the particle cloud morphing from "thinking" to "answer" is what made the device feel alive.',
    ],
  },
  {
    id: 'shpe-web',
    title: 'NJIT SHPE Website',
    description:
      "The official website for NJIT's SHPE chapter (shpenjit.org) — a fast, animated Next.js site spanning events, the annual Gala, convention, sponsors, programs, and team, with a self-serve admin dashboard the e-board uses to publish events.",
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GSAP'],
    githubUrl: 'https://github.com/shpewebmaster/website',
    githubPrivate: true,
    liveUrl: 'https://shpenjit.org',
    banner: {
      name: 'Society of Hispanic Professional Engineers',
      location: 'New Jersey Institute of Technology',
      image: '/projects/shpe-web/group.jpeg',
    },
    heroImage: '/projects/shpe-web/gala-home.jpg',
    heroPosition: 'top',
    situation:
      "The chapter's web presence was scattered and stale — a site the e-board couldn't touch without a developer, plus one-off microsites spun up for each event.",
    task: 'Build one polished, maintainable site for everything the chapter does — events, the annual Gala, convention, sponsorships, programs, and team — that the e-board can keep current themselves.',
    action:
      'Built shpenjit.org with Next.js (App Router) and TypeScript, styled in Tailwind, with motion from Framer Motion and GSAP and WebGL backdrops via OGL. Wired a calendar-backed events feed, a Resend-powered contact flow, and an admin dashboard for the e-board to publish events — plus dedicated microsites for the Gala (with its own sponsor deck), Convention, InternSHPE, and SHPEtinas.',
    solution:
      "Live at shpenjit.org as the chapter's front door — one codebase serving the whole org, animated and responsive, that the e-board maintains long after the developer graduates.",
    lessons: [
      'A shared design system across a dozen page types is what keeps a multi-purpose org site from fracturing into a dozen mismatched microsites.',
      'Shipping a self-serve admin makes maintainability a feature — the site stays current after the person who built it moves on.',
    ],
    images: [
      '/projects/shpe-web/gala-itinerary-design.jpg',
      '/projects/shpe-web/eboard-design.jpg',
      '/projects/shpe-web/shpetinas.png',
      '/projects/shpe-web/convention.png',
    ],
  },
  {
    id: 'autonomous-robot',
    title: 'Autonomous Robot Simulator',
    description:
      'A from-scratch 2D simulator for autonomous robot navigation — a differential-drive robot that steers itself to clicked waypoints with a proportional controller, plus manual keyboard driving and a live trajectory trail. Built in Python with Pygame.',
    techStack: ['Python', 'Pygame', 'NumPy', 'Matplotlib'],
    githubUrl: 'https://github.com/SJossue/Autonomous_Robot',
    banner: {
      name: 'Differential-Drive Robot',
      location: 'Waypoint navigation · Python + Pygame',
      image: '/projects/autonomous-robot/simulator.jpg',
    },
    heroImage: '/projects/autonomous-robot/loop.jpg',
    situation:
      'How a wheeled robot actually moves — and how a control loop turns a target into steering commands — is hard to feel from equations alone. I wanted a sandbox where differential-drive kinematics and closed-loop control play out in real time, not just on paper.',
    task: 'Build a 2D simulator from scratch where a two-wheeled robot can be driven by hand and can also navigate itself to a target, so both the motion model and the control law are visible and tunable.',
    action:
      'Modeled a differential-drive robot in Python / Pygame — pose integrated from independent left and right wheel velocities (x and y from the average wheel speed along the heading, θ from their difference over the wheelbase). For autonomy, a proportional controller reads the Euclidean distance and heading error to a clicked waypoint (target angle via atan2, error normalized to [-π, π]) and sets the wheel speeds with separate angular (0.5) and linear (0.3) gains, arriving within a 5-pixel threshold. Shipped three modes — manual (W/S and Q/A drive each wheel), fully autonomous, and a combined mode that hands control to the autopilot on a click and returns it on arrival — with a live velocity/heading readout, a body-frame axis overlay, and a rendered path trail.',
    solution:
      'A working navigation sandbox: click anywhere and the robot turns and drives to the point, tracing its path as it goes — or take the wheels yourself. Building the loop by hand made the gain tradeoff tangible: too much linear gain and it overshoots the turn, too little and it crawls.',
    lessons: [
      'Differential-drive motion is only a few lines of integration — but watching the pose update live is what finally made the kinematics click.',
      'A proportional controller is the smallest thing that already "looks autonomous"; tuning its two gains taught me more about control than any amount of reading about PID.',
      'Keeping manual, autonomous, and hand-off as separate modes over one robot model made it easy to compare driving it against watching it drive itself.',
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
];
