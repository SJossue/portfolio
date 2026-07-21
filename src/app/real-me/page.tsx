import type { Metadata } from 'next';

import IslandAside from '@/components/features/worlds/shared/IslandAside';
import IslandShell from '@/components/features/worlds/shared/IslandShell';
import RealMeIsland, { intro, sections } from '@/components/features/worlds/real-me/RealMeIsland';
import { aboutData } from '@/content/about';
import { worlds } from '@/content/worlds';

export const metadata: Metadata = {
  title: 'About Me',
  description: 'The human behind the code. Connect, chat, and get to know me.',
  alternates: { canonical: '/real-me' },
  openGraph: {
    title: 'About Me — Jossue Sarango',
    description: 'The human behind the code. Connect, chat, and get to know me.',
    url: '/real-me',
  },
};

const REALME_ACCENT = worlds.find((w) => w.id === 'real-me')?.color ?? '#10b981';

/** Right-panel block: what I'm up to right now, slotted between stats and socials. */
const currentlyBlock = (
  <section>
    <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
      Currently
    </p>
    <ul className="space-y-2">
      {aboutData.currently.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm text-white/75">
          <span
            aria-hidden
            className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
            style={{ background: REALME_ACCENT }}
          />
          {item}
        </li>
      ))}
    </ul>
  </section>
);

export default function RealMePage() {
  return (
    <IslandShell
      worldId="real-me"
      sections={sections}
      intro={intro}
      chat
      aside={
        <IslandAside worldId="real-me" showHighlights={false}>
          {currentlyBlock}
        </IslandAside>
      }
    >
      <RealMeIsland />
    </IslandShell>
  );
}
