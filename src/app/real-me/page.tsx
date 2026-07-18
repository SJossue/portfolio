import type { Metadata } from 'next';

import IslandAside from '@/components/features/worlds/shared/IslandAside';
import IslandShell from '@/components/features/worlds/shared/IslandShell';
import RealMeIsland, { sections } from '@/components/features/worlds/real-me/RealMeIsland';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'The human behind the code. Connect, chat, and get to know me.',
};

export default function RealMePage() {
  return (
    <IslandShell worldId="real-me" sections={sections} aside={<IslandAside worldId="real-me" />}>
      <RealMeIsland />
    </IslandShell>
  );
}
