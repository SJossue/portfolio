import type { Metadata } from 'next';
import WorldLayout from '@/components/features/worlds/shared/WorldLayout';
import RealMeWorld from '@/components/features/worlds/real-me/RealMeWorld';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'The human behind the code. Connect, chat, and get to know me.',
};

export default function RealMePage() {
  return (
    <WorldLayout worldId="real-me">
      <RealMeWorld />
    </WorldLayout>
  );
}
