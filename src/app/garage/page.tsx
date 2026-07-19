import type { Metadata } from 'next';

import GarageWorld from '@/components/features/worlds/garage/GarageWorld';

export const metadata: Metadata = {
  title: 'My Garage',
  description: 'Projects, tools, and the craft of building things that work.',
};

export default function GaragePage() {
  return <GarageWorld />;
}
