import type { Metadata } from 'next';

import IslandAside from '@/components/features/worlds/shared/IslandAside';
import IslandShell from '@/components/features/worlds/shared/IslandShell';
import TimelineIsland, { sections } from '@/components/features/worlds/timeline/TimelineIsland';

export const metadata: Metadata = {
  title: 'My Timeline',
  description: 'A journey through the roles, milestones, and moments that shaped the path.',
};

export default function TimelinePage() {
  return (
    <IslandShell
      worldId="timeline"
      sections={sections}
      aside={<IslandAside worldId="timeline" linkIds={['linkedin', 'email']} />}
    >
      <TimelineIsland />
    </IslandShell>
  );
}
