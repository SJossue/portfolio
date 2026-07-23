import type { Metadata } from 'next';

import ResourcesShell from '@/components/features/worlds/resources/ResourcesShell';
import { resourceStages } from '@/content/resources';

export const metadata: Metadata = {
  title: 'Resources',
  description:
    'Career advice, programs, and opportunities for students — organized by stage, with personal notes on each.',
  alternates: { canonical: '/resources' },
  openGraph: {
    title: 'Resources — Jossue Sarango',
    description: 'Career advice, programs, and opportunities for students.',
    url: '/resources',
  },
};

export default function ResourcesPage() {
  return <ResourcesShell stages={resourceStages} />;
}
