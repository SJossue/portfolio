import type { Metadata } from 'next';
import WorldLayout from '@/components/features/worlds/shared/WorldLayout';
import BarberWorld from '@/components/features/worlds/barber/BarberWorld';

export const metadata: Metadata = {
  title: 'My Timeline',
  description: 'A journey through the roles, milestones, and moments that shaped the path.',
};

export default function BarberPage() {
  return (
    <WorldLayout worldId="barber">
      <BarberWorld />
    </WorldLayout>
  );
}
