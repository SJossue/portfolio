import type { Metadata } from 'next';

import IslandAside from '@/components/features/worlds/shared/IslandAside';
import IslandShell from '@/components/features/worlds/shared/IslandShell';
import GarageIsland, { sections } from '@/components/features/worlds/garage/GarageIsland';

export const metadata: Metadata = {
  title: 'My Garage',
  description: 'Projects, tools, and the craft of building things that work.',
};

export default function GaragePage() {
  return (
    <IslandShell
      worldId="garage"
      sections={sections}
      aside={<IslandAside worldId="garage" linkIds={['github', 'linkedin', 'email']} />}
    >
      <GarageIsland />
    </IslandShell>
  );
}
