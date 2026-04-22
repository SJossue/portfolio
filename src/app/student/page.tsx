import type { Metadata } from 'next';
import WorldLayout from '@/components/features/worlds/shared/WorldLayout';
import StudentWorld from '@/components/features/worlds/student/StudentWorld';

export const metadata: Metadata = {
  title: 'The Student',
  description: 'Research, education, and the academic journey.',
};

export default function StudentPage() {
  return (
    <WorldLayout worldId="student">
      <StudentWorld />
    </WorldLayout>
  );
}
