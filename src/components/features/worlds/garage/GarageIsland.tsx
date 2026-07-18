'use client';

import { useState } from 'react';
import Image from 'next/image';

import type { IconType } from 'react-icons';
import {
  SiEspressif,
  SiNextdotjs,
  SiNvidia,
  SiPlatformio,
  SiPython,
  SiReact,
  SiRos,
  SiScikitlearn,
  SiStreamlit,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
} from 'react-icons/si';

import HubSocials from '@/components/features/hub/HubSocials';
import IslandSection from '@/components/features/worlds/shared/IslandSection';
import { projects } from '@/content/projects';
import { worlds } from '@/content/worlds';
import type { IslandSectionRef } from '@/components/features/worlds/shared/IslandShell';

const ACCENT = '249, 115, 22';

/** Left-rail directory — one entry per featured project, anchored to its card in
 *  the middle panel (scroll-spy + click-to-scroll via the shared TOC). */
export const sections: IslandSectionRef[] = projects.map((p) => ({
  id: p.id,
  label: p.title.split(':')[0],
}));

const TALLY = [
  { label: 'Projects', value: 6 },
  { label: 'Technologies', value: 14 },
  { label: 'Simulations', value: 50 },
  { label: 'Years Building', value: 3 },
];

/** SolidWorks isn't in Simple Icons (pulled over trademark) — a small local mark. */
function SolidWorksMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.7 6.6c-1.2-1-2.9-1.6-4.8-1.6-3 0-5.2 1.5-5.2 3.9 0 2 1.5 3.1 4.3 3.7l1.6.35c1.4.3 2 .7 2 1.4 0 .9-1 1.5-2.6 1.5-1.9 0-3.4-.6-4.6-1.7L5.9 17c1.4 1.1 3.4 1.7 5.6 1.7 3.3 0 5.6-1.6 5.6-4 0-2-1.3-3.2-4.2-3.8l-1.6-.34c-1.4-.3-2.1-.6-2.1-1.35 0-.85.9-1.4 2.4-1.4 1.6 0 3 .55 4.1 1.45z" />
    </svg>
  );
}

/** Curated toolbox — real, named industry programs & tools only (each with a
 *  recognizable logo). Generic skills (CAD, FEA, welding, embedded, integration)
 *  are intentionally excluded; they still live in `about.ts` for the chat. */
const TOOLS: { label: string; Icon: IconType; color: string }[] = [
  { label: 'SolidWorks', Icon: SolidWorksMark, color: '#E31E24' },
  { label: 'ROS 2', Icon: SiRos, color: '#E6ECF3' },
  { label: 'Jetson', Icon: SiNvidia, color: '#76B900' },
  { label: 'ESP32', Icon: SiEspressif, color: '#E7352C' },
  { label: 'PlatformIO', Icon: SiPlatformio, color: '#FF7F00' },
  { label: 'TypeScript', Icon: SiTypescript, color: '#3178C6' },
  { label: 'React', Icon: SiReact, color: '#61DAFB' },
  { label: 'Next.js', Icon: SiNextdotjs, color: '#FFFFFF' },
  { label: 'Tailwind', Icon: SiTailwindcss, color: '#38BDF8' },
  { label: 'Three.js', Icon: SiThreedotjs, color: '#FFFFFF' },
  { label: 'Supabase', Icon: SiSupabase, color: '#3ECF8E' },
  { label: 'Python', Icon: SiPython, color: '#5A9FD4' },
  { label: 'scikit-learn', Icon: SiScikitlearn, color: '#F7931E' },
  { label: 'Streamlit', Icon: SiStreamlit, color: '#FF4B4B' },
];

/** Short garage blurb — rendered in the left rail (via the shell's `intro`),
 *  so the middle panel opens straight on the featured projects. */
export const intro =
  'The workshop where projects, tools, and ideas come together. Six builds spanning mechanical systems, AI infrastructure, and product UX — each a different way to think through a problem, break it down, and refine it until it feels correct.';

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const hasStudy = Boolean(project.situation || project.task || project.action || project.solution);

  return (
    <article
      id={project.id}
      className="border-white/8 scroll-mt-6 overflow-hidden rounded-2xl border bg-white/[0.03]"
    >
      {project.heroImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={project.heroImage}
            alt={project.title}
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
            PROJECT · {String(index + 1).padStart(2, '0')}
          </div>
        </div>
      ) : null}

      <div className="p-5">
        <h3 className="text-lg font-bold text-white">{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{project.description}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-md px-2 py-0.5 font-mono text-[10px]"
              style={{ background: `rgba(${ACCENT}, 0.12)`, color: `rgb(${ACCENT})` }}
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-4">
          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-white/55 transition-colors hover:text-white"
            >
              GitHub &rarr;
            </a>
          ) : null}
          {hasStudy ? (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="font-mono text-xs text-white/40 transition-colors hover:text-white"
            >
              {open ? 'Show less' : 'View case study'}
            </button>
          ) : null}
        </div>

        {open && hasStudy ? (
          <dl className="border-white/8 mt-4 space-y-2 border-t pt-4 text-sm text-white/70">
            {(
              [
                ['Situation', project.situation],
                ['Task', project.task],
                ['Action', project.action],
                ['Result', project.solution],
              ] as const
            ).map(([label, value]) =>
              value ? (
                <div key={label}>
                  <dt
                    className="inline font-mono font-semibold"
                    style={{ color: `rgb(${ACCENT})` }}
                  >
                    {label}:
                  </dt>{' '}
                  <dd className="inline">{value}</dd>
                </div>
              ) : null,
            )}
            {project.lessons && project.lessons.length > 0 ? (
              <div>
                <dt className="font-mono font-semibold" style={{ color: `rgb(${ACCENT})` }}>
                  Lessons:
                </dt>
                <ul className="mt-1 space-y-1 pl-4">
                  {project.lessons.map((l) => (
                    <li key={l} className="list-disc">
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>
    </article>
  );
}

/**
 * My Garage — projects & craft. The middle panel is the featured-project case
 * studies; the toolbox and tally live in the right panel (see `GarageAside`).
 */
export default function GarageIsland() {
  return (
    <div className="text-white">
      <IslandSection id="projects" title="Featured Projects">
        <div className="space-y-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </IslandSection>
    </div>
  );
}

/**
 * Garage right panel: the toolbox (tools & skills) and the tally, with the
 * social links centered at the bottom.
 */
export function GarageAside() {
  const world = worlds.find((w) => w.id === 'garage') ?? worlds[0];

  return (
    <div className="flex h-full flex-col gap-8 p-6 text-white">
      <section>
        <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
          Tools &amp; Software
        </p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
          {TOOLS.map(({ label, Icon, color }) => (
            <li key={label} title={label} className="flex items-center gap-2.5">
              <Icon aria-hidden className="h-[18px] w-[18px] flex-shrink-0" style={{ color }} />
              <span className="truncate text-sm text-white/85">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <p className="mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">
          The Tally
        </p>
        <div className="grid grid-cols-2 gap-3">
          {TALLY.map((stat) => (
            <div
              key={stat.label}
              className="border-white/8 rounded-2xl border bg-white/[0.02] p-4 text-center"
            >
              <p className="text-3xl font-black text-white">
                {stat.value}
                {stat.value >= 10 ? <span style={{ color: `rgb(${ACCENT})` }}>+</span> : null}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-auto flex justify-center pt-2">
        <HubSocials accentColor={world.color} accentRgb={world.colorRgb} layout="inline" />
      </div>
    </div>
  );
}
