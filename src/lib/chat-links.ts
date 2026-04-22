import { contactLinks } from '@/content/contact';
import { worlds } from '@/content/worlds';

export interface ChatLink {
  patterns: string[];
  href: string;
  external?: boolean;
}

const worldById = Object.fromEntries(worlds.map((w) => [w.id, w] as const));
const contactById = Object.fromEntries(contactLinks.map((c) => [c.id, c] as const));

export const chatLinks: readonly ChatLink[] = [
  { patterns: ['Garage world', 'Garage'], href: worldById.garage.slug },
  { patterns: ['Timeline world', 'Timeline'], href: worldById.timeline.slug },
  { patterns: ['Student world'], href: worldById.student.slug },
  { patterns: ['Real Me'], href: worldById['real-me'].slug },
  { patterns: ['GitHub'], href: contactById.github.href, external: true },
  { patterns: ['LinkedIn'], href: contactById.linkedin.href, external: true },
  {
    patterns: ['email me', 'email Jossue'],
    href: contactById.email.href,
    external: true,
  },
];

export function isSafeHref(href: string): boolean {
  return (
    href.startsWith('/') ||
    href.startsWith('https://') ||
    href.startsWith('http://') ||
    href.startsWith('mailto:')
  );
}

export function isInternalHref(href: string): boolean {
  return href.startsWith('/');
}
