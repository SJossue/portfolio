import Image from 'next/image';

import IslandSection from '@/components/features/worlds/shared/IslandSection';
import type { IslandSectionRef } from '@/components/features/worlds/shared/IslandShell';
import { experienceData } from '@/content/experience';

const ACCENT = '139, 92, 246';

export const sections: IslandSectionRef[] = [
  { id: 'experience', label: 'Experience' },
  { id: 'leadership', label: 'Leadership' },
];

/** Left-rail blurb — the timeline's title lives in the left panel heading; this is its description. */
export const intro =
  'The roles, milestones, and moments that shaped the path. Eleven chapters across engineering teams, program management, and public-service leadership — each one a step in learning how to build, lead, and show up for the people around me.';

/** A role is "current" when its period runs to the present. */
function isCurrent(period: string): boolean {
  return /present/i.test(period);
}

/**
 * Fallback initials for orgs without a real logo yet — up to three letters from
 * the significant words in the company name.
 */
function monogram(company: string): string {
  // Prefer a parenthetical acronym when present, e.g. "…(SHPE)…" → "SHPE".
  const acronym = company.match(/\(([A-Z][A-Za-z.&]{1,6})\)/);
  if (acronym) return acronym[1].replace(/\./g, '').toUpperCase();

  const stop = new Set(['at', 'of', 'the', 'and', 'for', 'a']);
  const words = company
    .replace(/\(.*?\)/g, ' ') // drop parentheticals
    .split(/[\s.]+/)
    .filter((w) => w && !stop.has(w.toLowerCase()));
  return words
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function OrgLogo({ entry }: { entry: (typeof experienceData)[number] }) {
  if (entry.logo) {
    return (
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white p-1.5">
        <Image
          src={entry.logo}
          alt={`${entry.company} logo`}
          fill
          sizes="44px"
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
      style={{
        background: `rgba(${ACCENT}, 0.14)`,
        border: `1px solid rgba(${ACCENT}, 0.35)`,
        color: `rgb(${ACCENT})`,
      }}
    >
      {monogram(entry.company)}
    </div>
  );
}

function NowBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider"
      style={{ background: `rgba(${ACCENT}, 0.16)`, color: `rgb(${ACCENT})` }}
    >
      <span
        className="h-1.5 w-1.5 animate-pulse rounded-full"
        style={{ background: `rgb(${ACCENT})` }}
      />
      Now
    </span>
  );
}

function ExperienceItem({ entry }: { entry: (typeof experienceData)[number] }) {
  const current = isCurrent(entry.period);
  return (
    <li className="relative pl-8">
      {/* Timeline rail dot — brighter + pulsing for a current role. */}
      <span
        aria-hidden
        className={`absolute left-[-4.5px] top-6 h-2.5 w-2.5 rounded-full ring-4 ring-[#07070b] ${
          current ? 'animate-pulse' : ''
        }`}
        style={{ background: current ? `rgb(${ACCENT})` : `rgba(${ACCENT}, 0.55)` }}
      />
      <div className="border-white/8 rounded-2xl border bg-white/[0.03] p-5">
        <div className="flex items-start gap-3">
          <OrgLogo entry={entry} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h3 className="text-lg font-bold text-white">{entry.role}</h3>
              {current ? <NowBadge /> : null}
            </div>
            <p className="mt-1 text-sm text-white/50">
              {entry.company}
              {' · '}
              <span className="font-mono text-xs">{entry.period}</span>
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-white/60">{entry.description}</p>

        {entry.achievements && entry.achievements.length > 0 ? (
          <ul className="mt-3 space-y-1 pl-4 text-sm text-white/60">
            {entry.achievements.map((a) => (
              <li key={a} className="list-disc">
                {a}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {entry.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md px-2 py-0.5 font-mono text-[10px]"
              style={{ background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </li>
  );
}

function Band({ entries }: { entries: typeof experienceData }) {
  return (
    <ol className="relative space-y-6 border-l border-white/10 pl-2">
      {entries.map((entry) => (
        <ExperienceItem key={entry.id} entry={entry} />
      ))}
    </ol>
  );
}

/**
 * My Timeline — roles & milestones. Primary (middle-panel) content: two bands,
 * Experience then Leadership, each a vertical timeline rail. The page title and
 * description live in the left rail; here the roles carry the story. Built from
 * `experienceData`, ordered most-recent-first within each section.
 */
export default function TimelineIsland() {
  const experience = experienceData.filter((e) => e.section === 'experience');
  const leadership = experienceData.filter((e) => e.section === 'leadership');

  return (
    <div className="text-white">
      <IslandSection id="experience" eyebrow="Roles & Milestones" title="Experience">
        <Band entries={experience} />
      </IslandSection>

      <IslandSection id="leadership" eyebrow="People & Service" title="Leadership">
        <Band entries={leadership} />
      </IslandSection>
    </div>
  );
}
