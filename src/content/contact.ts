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
    icon: '/>',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/',
    icon: 'in',
  },
  {
    id: 'email',
    label: 'Email',
    href: 'mailto:hello@example.com',
    icon: '@',
  },
];
