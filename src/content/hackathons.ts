export interface Hackathon {
  id: string;
  name: string;
  /** Candid photo from the hackathon. */
  image: string;
  /** "City, ST" — shown as the subtitle under the name. */
  location: string;
}

export const hackathons: Hackathon[] = [
  {
    id: 'claude',
    name: 'Claude Hackathon',
    image: '/hackathons/claude-hackathon.jpeg',
    location: 'San Francisco, CA',
  },
  {
    id: 'aws',
    name: 'AWS Hackathon',
    image: '/hackathons/aws-hackathon.jpeg',
    location: 'New York, NY',
  },
  {
    id: 'cmu',
    name: 'CMU Hackathon',
    image: '/hackathons/cmu-hackathon.jpeg',
    location: 'Pittsburgh, PA',
  },
  {
    id: 'princeton',
    name: 'Princeton Hackathon',
    image: '/hackathons/princeton-hackathon.jpeg',
    location: 'Princeton, NJ',
  },
];
