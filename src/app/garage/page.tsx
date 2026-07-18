import type { Metadata } from 'next';

import IslandShell from '@/components/features/worlds/shared/IslandShell';
import GarageIsland, {
  GarageAside,
  intro,
  sections,
} from '@/components/features/worlds/garage/GarageIsland';

export const metadata: Metadata = {
  title: 'My Garage',
  description: 'Projects, tools, and the craft of building things that work.',
};

export default function GaragePage() {
  return (
    <IslandShell worldId="garage" sections={sections} intro={intro} aside={<GarageAside />}>
      <GarageIsland />
    </IslandShell>
  );
}
