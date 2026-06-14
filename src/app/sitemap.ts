import type { MetadataRoute } from 'next';

import { worlds } from '@/content/worlds';
import { siteConfig } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...worlds.map((world) => ({
      url: `${siteConfig.url}${world.slug}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/book`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
