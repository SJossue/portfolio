import type { Metadata } from 'next';

import TimelineWorld from '@/components/features/worlds/timeline/TimelineWorld';
import WorldLayout from '@/components/features/worlds/shared/WorldLayout';

export const metadata: Metadata = {
  title: 'My Timeline',
  description: 'A journey through the roles, milestones, and moments that shaped the path.',
};

export default function TimelinePage() {
  return (
    <WorldLayout worldId="timeline">
      <TimelineWorld />
    </WorldLayout>
  );
}
