import type { Metadata } from 'next';

import IslandAside from '@/components/features/worlds/shared/IslandAside';
import IslandShell from '@/components/features/worlds/shared/IslandShell';
import TimelineIsland, {
  intro,
  sections,
} from '@/components/features/worlds/timeline/TimelineIsland';
import { worlds } from '@/content/worlds';

export const metadata: Metadata = {
  title: 'My Timeline',
  description: 'A journey through the roles, milestones, and moments that shaped the path.',
  alternates: { canonical: '/timeline' },
  openGraph: {
    title: 'My Timeline — Jossue Sarango',
    description: 'A journey through the roles, milestones, and moments that shaped the path.',
    url: '/timeline',
  },
};

const TIMELINE_ACCENT = worlds.find((w) => w.id === 'timeline')?.color ?? '#8b5cf6';

/** Curated recurring strengths — the intentional replacement for the old auto-dumped themes. */
const THREADS = [
  'Hardware + software',
  'Cross-functional leadership',
  'Program & project management',
  'Public service',
];

/** Right-panel block: the threads that run through the work, slotted between stats and socials. */
const timelineThreads = (
  <section>
    <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">Threads</p>
    <ul className="flex flex-wrap gap-1.5">
      {THREADS.map((thread) => (
        <li
          key={thread}
          className="rounded-lg border px-2.5 py-1 text-xs text-white/75"
          style={{ borderColor: `${TIMELINE_ACCENT}33`, background: `${TIMELINE_ACCENT}12` }}
        >
          {thread}
        </li>
      ))}
    </ul>
  </section>
);

export default function TimelinePage() {
  return (
    <IslandShell
      worldId="timeline"
      sections={sections}
      intro={intro}
      chat
      aside={
        <IslandAside worldId="timeline" showHighlights={false}>
          {timelineThreads}
        </IslandAside>
      }
    >
      <TimelineIsland />
    </IslandShell>
  );
}
