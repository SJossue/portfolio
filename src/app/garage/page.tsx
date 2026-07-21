import type { Metadata } from 'next';

import GarageWorld from '@/components/features/worlds/garage/GarageWorld';

export const metadata: Metadata = {
  title: 'My Garage',
  description: 'Projects, tools, and the craft of building things that work.',
  alternates: { canonical: '/garage' },
  openGraph: {
    title: 'My Garage — Jossue Sarango',
    description: 'Projects, tools, and the craft of building things that work.',
    url: '/garage',
  },
};

export default function GaragePage() {
  return <GarageWorld />;
}
