import Image from 'next/image';

import HubSocials from '@/components/features/hub/HubSocials';
import { educationData } from '@/content/education';
import type { ResearchEntry } from '@/content/research';
import { worlds } from '@/content/worlds';

/**
 * Server-only presentational pieces for the student world — every leaf that
 * renders paper/education content with zero interactivity. None of this carries
 * a 'use client' directive, so none of it ships to the browser: `student/page.tsx`
 * calls these directly to produce plain ReactNode trees, which `StudentShell`
 * (the client component) only ever picks between.
 */

const world = worlds.find((w) => w.id === 'student') ?? worlds[0];
export const ACCENT = world.colorRgb;
export const WORLD = world;

export const eyebrow = 'mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45';

export interface SectionRef {
  id: string;
  label: string;
}

export const SECTIONS: SectionRef[] = [
  { id: 'education', label: 'Education & Focus' },
  { id: 'research', label: 'Research' },
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

/** The research topics chip cloud shown in Education & Focus (world stat: 7). */
const RESEARCH_TOPICS = [
  'Autonomous Systems',
  'Ethics',
  'A* Path Planning',
  'Hybrid-Electric Aircraft',
  'Maglev',
  'Sustainability',
  'Urban Mobility',
];

/** The throughlines that connect the papers — the right-rail "Focus" block. */
export const FOCUS = ['Sustainable transport', 'Autonomy & ethics', 'Urban mobility'];

/** Right-rail tally — real figures drawn from the paper bodies. */
export const TALLY: { label: string; value: string }[] = [
  { label: 'Papers', value: '3' },
  { label: 'Research topics', value: '7' },
  { label: 'Words written', value: '6.3K' },
  { label: 'Works cited', value: '36' },
];

export function Socials() {
  return (
    <div className="mt-auto flex justify-center pt-2">
      <HubSocials accentColor={world.color} accentRgb={world.colorRgb} layout="inline" />
    </div>
  );
}

export function TopicChips({ topics }: { topics: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {topics.map((t) => (
        <li
          key={t}
          className="rounded-md px-2 py-0.5 font-mono text-[10px]"
          style={{ background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }}
        >
          {t}
        </li>
      ))}
    </ul>
  );
}

/** A paper preview's body content — image, badge, title, summary, topics, and
 *  the "Read paper →" affordance. The click behavior is added by the caller (a
 *  `StudentSelectTrigger` wrapping this). */
export function PaperCardBody({ entry, index }: { entry: ResearchEntry; index: number }) {
  const summary = PAPER_SUMMARIES[entry.id];
  return (
    <>
      {entry.heroImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={entry.heroImage}
            alt={entry.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
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

        {entry.topics?.length ? (
          <div className="mt-3">
            <TopicChips topics={entry.topics} />
          </div>
        ) : null}

        <span
          className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold"
          style={{ color: `rgb(${ACCENT})` }}
        >
          Read paper <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </>
  );
}

/** Education & Focus — the degree, the credibility markers, and the topic cloud.
 *  GPA / graduation / coursework render only once real values land in
 *  `education.ts`, so nothing placeholder ever ships. */
export function EducationBlock() {
  const { schoolShort, degree, minor, gpa, gradTerm, coursework, honors } = educationData;
  return (
    <div className="space-y-6">
      <div className="border-white/8 rounded-2xl border bg-white/[0.03] p-5">
        <p
          className="font-mono text-xs font-bold uppercase tracking-wider"
          style={{ color: `rgb(${ACCENT})` }}
        >
          {schoolShort}
        </p>
        <h3 className="mt-2 text-lg font-bold text-white">{degree}</h3>
        {minor ? (
          <p className="mt-1 text-sm text-white/60">
            Minor in {minor} — New Jersey Institute of Technology.
          </p>
        ) : null}
        {gpa || gradTerm ? (
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {gpa ? (
              <div>
                <p className="text-xl font-black text-white">{gpa}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/60">GPA</p>
              </div>
            ) : null}
            {gradTerm ? (
              <div>
                <p className="text-xl font-black text-white">{gradTerm}</p>
                <p className="font-mono text-[10px] uppercase tracking-wider text-white/60">
                  Expected graduation
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {honors.length > 0 ? (
        <div>
          <p className={eyebrow}>Honors &amp; Fellowships</p>
          <ul className="space-y-2">
            {honors.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm text-white/75">
                <span
                  aria-hidden
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                  style={{ background: `rgb(${ACCENT})` }}
                />
                {h}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {coursework.length > 0 ? (
        <div>
          <p className={eyebrow}>Relevant Coursework</p>
          <ul className="flex flex-wrap gap-1.5">
            {coursework.map((c) => (
              <li
                key={c}
                className="border-white/8 rounded-lg border bg-white/[0.03] px-2.5 py-1 text-xs text-white/75"
              >
                {c}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div>
        <p className={eyebrow}>Research Topics</p>
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
    </div>
  );
}
