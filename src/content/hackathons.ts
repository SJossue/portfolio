export interface Hackathon {
  id: string;
  name: string;
  /** Candid photo from the hackathon. */
  image: string;
  /** Event logo (landscape banner). */
  logo: string;
}

export const hackathons: Hackathon[] = [
  {
    id: 'claude',
    name: 'Claude Hackathon',
    image: '/hackathons/claude-hackathon.jpeg',
    logo: '/hackathons/claude-logo.png',
  },
  {
    id: 'aws',
    name: 'AWS Hackathon',
    image: '/hackathons/aws-hackathon.jpeg',
    logo: '/hackathons/aws-logo.png',
  },
  {
    id: 'cmu',
    name: 'CMU Hackathon',
    image: '/hackathons/cmu-hackathon.jpeg',
    logo: '/hackathons/cmu-logo.png',
  },
  {
    id: 'princeton',
    name: 'Princeton Hackathon',
    image: '/hackathons/princeton-hackathon.jpeg',
    logo: '/hackathons/princeton-logo.png',
  },
];
