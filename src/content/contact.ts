export interface ContactLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}

export const contactLinks: ContactLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/SJossue',
    icon: 'GH',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/jossue-sarango',
    icon: 'LI',
  },
  {
    id: 'x',
    label: 'X',
    href: 'https://x.com/JossueAI',
    icon: 'X',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:jossuesarango1@gmail.com',
    icon: '✉',
  },
];
