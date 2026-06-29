import IslandSection from '@/components/features/worlds/shared/IslandSection';
import { experienceData } from '@/content/experience';
import type { IslandSectionRef } from '@/components/features/worlds/shared/IslandShell';

const ACCENT = '139, 92, 246';

export const sections: IslandSectionRef[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'experience', label: 'Experience' },
  { id: 'themes', label: 'Recurring Themes' },
];

function ExperienceItem({ entry }: { entry: (typeof experienceData)[number] }) {
  return (
    <li className="relative pl-8">
      {/* Timeline rail dot */}
      <span
        aria-hidden
        className="absolute left-[-4.5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[#07070b]"
        style={{ background: `rgb(${ACCENT})` }}
      />
      <div className="border-white/8 rounded-2xl border bg-white/[0.03] p-5">
        <h3 className="text-lg font-bold text-white">{entry.role}</h3>
        <p className="mt-1 text-sm text-white/50">
          {entry.company}
          {' · '}
          <span className="font-mono text-xs">{entry.period}</span>
        </p>

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

/**
 * My Timeline — roles & milestones. Primary (middle-panel) content: an overview,
 * the full experience as a vertical timeline rail, and the recurring themes that
 * thread through the work. Built fresh from `experienceData`.
 */
export default function TimelineIsland() {
  const themes = Array.from(new Set(experienceData.flatMap((e) => e.techStack)));

  return (
    <div className="text-white">
      <IslandSection id="overview" eyebrow="A journey" title="My Timeline">
        <p className="max-w-prose text-base leading-relaxed text-white/70">
          The roles, milestones, and moments that shaped the path. Eight chapters spanning
          engineering teams, public service fellowships, and student leadership — each one a step in
          learning how to build, lead, and show up for the people around me.
        </p>
      </IslandSection>

      <IslandSection id="experience" eyebrow="Roles & Milestones" title="Experience">
        <ol className="relative space-y-6 border-l border-white/10 pl-2">
          {experienceData.map((entry) => (
            <ExperienceItem key={entry.id} entry={entry} />
          ))}
        </ol>
      </IslandSection>

      <IslandSection id="themes" eyebrow="Threads" title="Recurring Themes">
        <ul className="flex flex-wrap gap-2">
          {themes.map((theme) => (
            <li
              key={theme}
              className="border-white/8 rounded-lg border bg-white/[0.03] px-3 py-1.5 text-sm text-white/75"
            >
              {theme}
            </li>
          ))}
        </ul>
      </IslandSection>
    </div>
  );
}
