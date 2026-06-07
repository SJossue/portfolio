import { contactLinks } from '@/content/contact';
import { aboutData } from '@/content/about';
import { siteConfig } from '@/lib/site';

export function JsonLd() {
  // Social/profile URLs (exclude mailto: links from sameAs).
  const sameAs = contactLinks.map((link) => link.href).filter((href) => href.startsWith('http'));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author,
    url: siteConfig.url,
    jobTitle: aboutData.roleTitle,
    alumniOf: 'New Jersey Institute of Technology',
    knowsAbout: siteConfig.keywords,
    sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
