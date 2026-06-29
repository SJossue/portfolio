import type { Metadata } from 'next';

import IslandAside from '@/components/features/worlds/shared/IslandAside';
import IslandShell from '@/components/features/worlds/shared/IslandShell';
import StudentIsland, { sections } from '@/components/features/worlds/student/StudentIsland';

export const metadata: Metadata = {
  title: 'The Student',
  description: 'Research, education, and the academic journey.',
};

export default function StudentPage() {
  return (
    <IslandShell
      worldId="student"
      sections={sections}
      aside={<IslandAside worldId="student" linkIds={['github', 'linkedin', 'email']} />}
    >
      <StudentIsland />
    </IslandShell>
  );
}
