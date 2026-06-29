import Image from 'next/image';

import IslandSection from '@/components/features/worlds/shared/IslandSection';
import { researchData } from '@/content/research';
import type { IslandSectionRef } from '@/components/features/worlds/shared/IslandShell';

const ACCENT = '6, 182, 212';

export const sections: IslandSectionRef[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'research', label: 'Research' },
  { id: 'education', label: 'Education & Focus' },
];

/** Concise, hand-written summaries — never a dump of the markdown body. */
const PAPER_SUMMARIES: Record<string, string> = {
  'future-of-flight':
    'A look at how hybrid-electric propulsion can cut aviation’s carbon footprint and revive regional air travel — pairing electric motors with combustion engines for quieter, cleaner, shorter-haul flight.',
  'hybrid-air-white-paper':
    'A white paper weighing the feasibility of integrating electric and hybrid-electric aircraft systems — the propulsion mechanics, the economic and environmental drivers, and the battery, charging, and infrastructure barriers still in the way.',
  'urban-maglev':
    'A study of how Shanghai’s Transrapid maglev fits into a dense city — analyzing electromagnetic-suspension vibration, ground subsidence, and the monitoring and maintenance practices needed to replicate the line elsewhere.',
};

const RESEARCH_TOPICS = [
  'Autonomous Systems',
  'Ethics',
  'A* Path Planning',
  'Hybrid-Electric Aircraft',
  'Maglev',
  'Sustainability',
  'Urban Mobility',
];

function PaperCard({ entry, index }: { entry: (typeof researchData)[number]; index: number }) {
  const summary = PAPER_SUMMARIES[entry.id];

  return (
    <article className="border-white/8 overflow-hidden rounded-2xl border bg-white/[0.03]">
      {entry.heroImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={entry.heroImage}
            alt={entry.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div
            className="absolute left-3 top-3 rounded-md border px-2 py-0.5 font-mono text-[10px]"
            style={{
              borderColor: `rgba(${ACCENT}, 0.4)`,
              background: 'rgba(0,0,0,0.4)',
              color: `rgb(${ACCENT})`,
            }}
          >
            PAPER · {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      ) : null}

      <div className="p-5">
        <h3 className="text-lg font-bold text-white">{entry.title}</h3>
        {summary ? <p className="mt-2 text-sm leading-relaxed text-white/60">{summary}</p> : null}

        {entry.pdfUrl ? (
          <div className="mt-4">
            <a
              href={entry.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-white/55 transition-colors hover:text-white"
            >
              Download PDF &rarr;
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/**
 * The Student — research & education. Primary (middle-panel) content: a short
 * overview, the three research papers, and the academic foundation. Built from
 * `research` content + the `student` world metadata.
 */
export default function StudentIsland() {
  return (
    <div className="text-white">
      <IslandSection id="overview" eyebrow="The academic side" title="The Student">
        <p className="max-w-prose text-base leading-relaxed text-white/70">
          The grind behind the build — curiosity that turns into late nights, citations, and the
          occasional breakthrough. I&apos;m pursuing a BS in Mechanical Engineering with a minor in
          Electrical Engineering at NJIT, where most of my research lives at the intersection of
          sustainability, autonomy, and how new transportation technology actually fits into the
          world.
        </p>
      </IslandSection>

      <IslandSection id="research" eyebrow="Papers" title="Research">
        <div className="space-y-6">
          {researchData.map((entry, i) => (
            <PaperCard key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </IslandSection>

      <IslandSection id="education" eyebrow="Foundation" title="Education & Focus">
        <div className="border-white/8 rounded-2xl border bg-white/[0.03] p-5">
          <p
            className="font-mono text-xs font-bold uppercase tracking-wider"
            style={{ color: `rgb(${ACCENT})` }}
          >
            NJIT
          </p>
          <h3 className="mt-2 text-lg font-bold text-white">BS, Mechanical Engineering</h3>
          <p className="mt-1 text-sm text-white/60">
            Minor in Electrical Engineering — New Jersey Institute of Technology.
          </p>
        </div>

        <div className="mt-6">
          <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
            Research Topics
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {RESEARCH_TOPICS.map((topic) => (
              <li
                key={topic}
                className="border-white/8 rounded-lg border bg-white/[0.03] px-2.5 py-1 text-xs text-white/75"
              >
                {topic}
              </li>
            ))}
          </ul>
        </div>
      </IslandSection>
    </div>
  );
}
