import type { Metadata } from 'next';
import Image from 'next/image';

import { GarageSelectTrigger } from '@/components/features/worlds/garage/GarageSelectTrigger';
import GarageShell from '@/components/features/worlds/garage/GarageShell';
import {
  ACCENT,
  CaseStudy,
  ExternalLinks,
  Gallery,
  OVERVIEW_TOOLS,
  PinIcon,
  ProjectCardBody,
  ReportCard,
  Socials,
  SpotlightHero,
  TALLY,
  ToolRow,
  TrophyIcon,
  WORLD,
  buildExternalLinks,
  eyebrow,
  resolveHeroHackathon,
} from '@/components/features/worlds/garage/GarageStatic';
import { projects } from '@/content/projects';

export const metadata: Metadata = {
  title: 'My Garage',
  description: 'Projects, tools, and the craft of building things that work.',
  alternates: { canonical: '/garage' },
  openGraph: {
    title: 'My Garage — Jossue Sarango',
    description: 'Projects, tools, and the craft of building things that work.',
    url: '/garage',
  },
};

const intro =
  'The workshop where projects, tools, and ideas come together. Nine builds spanning mechanical systems, AI infrastructure, and product UX — each a different way to think through a problem, break it down, and refine it until it feels correct.';

// Precompute every project's detail panels once, server-side. The client shell
// (GarageShell) only ever picks between these ready-made nodes and the overview
// ones below — none of this content, the react-icons set it depends on, or the
// full `projects` prose ever reaches the client bundle.
const details = Object.fromEntries(
  projects.map((project) => {
    const heroHackathon = resolveHeroHackathon(project);
    const externalLinks = buildExternalLinks(project);

    const left = heroHackathon ? (
      <SpotlightHero
        image={heroHackathon.image}
        title={heroHackathon.name}
        subtitle={heroHackathon.location}
        badge={'award' in heroHackathon ? heroHackathon.award : undefined}
        icon={<TrophyIcon />}
      />
    ) : project.banner ? (
      <SpotlightHero
        image={project.banner.image}
        title={project.banner.name}
        subtitle={project.banner.location}
        icon={<PinIcon />}
      />
    ) : (
      <>
        <div>
          <h2 className="text-lg font-bold tracking-tight" style={{ color: WORLD.color }}>
            {project.title}
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-white/70">{project.description}</p>
      </>
    );

    const centerNode = (
      <article className="text-white">
        {project.heroImage ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
              style={project.heroPosition ? { objectPosition: project.heroPosition } : undefined}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          </div>
        ) : (
          <div className="aspect-[16/9] w-full" style={{ background: `rgba(${ACCENT}, 0.12)` }} />
        )}
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{project.title}</h1>
          <p className="mt-3 max-w-prose leading-relaxed text-white/70">{project.description}</p>
          <CaseStudy project={project} />
          {project.images?.length ? (
            <Gallery images={project.images} title={project.title} />
          ) : null}
        </div>
      </article>
    );

    const right = (
      <div className="flex h-full flex-col gap-8 p-6 text-white">
        <section>
          <p className={eyebrow}>Tools &amp; Software</p>
          <ul className="space-y-3">
            {project.techStack.map((name) => (
              <ToolRow key={name} name={name} />
            ))}
          </ul>
        </section>
        <ExternalLinks links={externalLinks} />
        {project.report ? (
          <section>
            <p className={eyebrow}>Report</p>
            <ReportCard report={project.report} />
          </section>
        ) : null}
        <Socials />
      </div>
    );

    return [project.id, { left, center: centerNode, right }];
  }),
);

const projectTitles = Object.fromEntries(projects.map((p) => [p.id, p.title]));

const overviewLeftBody = (
  <>
    <p className="text-sm leading-relaxed text-white/60">{intro}</p>
    <nav aria-label="Projects" className="flex flex-col gap-0.5">
      {projects.map((p) => (
        <GarageSelectTrigger
          key={p.id}
          projectId={p.id}
          className="rounded-lg px-3 py-2 text-left text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white lg:border-l-2 lg:border-transparent"
        >
          {p.navLabel ?? p.title.split(':')[0]}
        </GarageSelectTrigger>
      ))}
    </nav>
  </>
);

const overviewCenter = (
  <div className="text-white">
    <div className="border-b border-white/5 px-6 pb-4 pt-8 sm:px-8">
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured Projects</h2>
    </div>
    <div className="space-y-6 px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
      {projects.map((p) => (
        <GarageSelectTrigger
          key={p.id}
          projectId={p.id}
          className="border-white/8 group block w-full overflow-hidden rounded-2xl border bg-white/[0.03] text-left transition-colors hover:border-[color:var(--world-color)]"
          style={{ ['--world-color' as string]: `rgba(${ACCENT}, 0.5)` }}
        >
          <ProjectCardBody project={p} />
        </GarageSelectTrigger>
      ))}
    </div>
  </div>
);

const overviewRight = (
  <div className="flex h-full flex-col gap-8 p-6 text-white">
    <section>
      <p className={eyebrow}>Tools &amp; Software</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-3">
        {OVERVIEW_TOOLS.map(([name, label]) => (
          <ToolRow key={name} name={name} label={label} />
        ))}
      </ul>
    </section>

    <section>
      <p className={eyebrow}>The Tally</p>
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
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-white/60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>

    <Socials />
  </div>
);

export default function GaragePage() {
  return (
    <GarageShell
      worldName={WORLD.name}
      worldColor={WORLD.color}
      worldColorRgb={WORLD.colorRgb}
      overviewLeftBody={overviewLeftBody}
      overviewCenter={overviewCenter}
      overviewRight={overviewRight}
      projectTitles={projectTitles}
      details={details}
    />
  );
}
