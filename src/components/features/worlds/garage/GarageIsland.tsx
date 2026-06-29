'use client';

import { useState } from 'react';
import Image from 'next/image';

import IslandSection from '@/components/features/worlds/shared/IslandSection';
import { aboutData } from '@/content/about';
import { projects } from '@/content/projects';
import type { IslandSectionRef } from '@/components/features/worlds/shared/IslandShell';

const ACCENT = '249, 115, 22';

export const sections: IslandSectionRef[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'toolbox', label: 'Toolbox' },
  { id: 'numbers', label: 'By the Numbers' },
];

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [open, setOpen] = useState(false);
  const hasStudy = Boolean(project.situation || project.task || project.action || project.solution);

  return (
    <article className="border-white/8 overflow-hidden rounded-2xl border bg-white/[0.03]">
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
 * My Garage — projects & craft. Primary (middle-panel) content: an overview, the
 * project case studies, the toolbox, and the numbers. Rebuilt fresh from
 * `projects` + `about` content.
 */
export default function GarageIsland() {
  return (
    <div className="text-white">
      <IslandSection id="overview" eyebrow="Where ideas become real" title="My Garage">
        <p className="max-w-prose text-base leading-relaxed text-white/70">
          The workshop where projects, tools, and ideas come together. Six builds spanning
          mechanical systems, AI infrastructure, and product UX — each a different way to think
          through a problem, break it down, and refine it until it feels correct.
        </p>
      </IslandSection>

      <IslandSection id="projects" eyebrow="Case Studies" title="Featured Projects">
        <div className="space-y-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </IslandSection>

      <IslandSection id="toolbox" eyebrow="The Toolbox" title="Tools & Skills">
        <div className="grid gap-4 sm:grid-cols-2">
          {aboutData.skills.map((group) => (
            <div
              key={group.category}
              className="border-white/8 rounded-2xl border bg-white/[0.02] p-5"
            >
              <h3
                className="mb-3 font-mono text-xs font-bold uppercase tracking-wider"
                style={{ color: `rgb(${ACCENT})` }}
              >
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((skill) => (
                  <li
                    key={skill}
                    className="border-white/8 rounded-lg border bg-white/[0.03] px-2.5 py-1 text-xs text-white/75"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </IslandSection>

      <IslandSection id="numbers" eyebrow="By the Numbers" title="The Tally">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Projects', value: 6 },
            { label: 'Technologies', value: 14 },
            { label: 'Simulations', value: 50 },
            { label: 'Years Building', value: 3 },
          ].map((stat) => (
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
      </IslandSection>
    </div>
  );
}
