'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { IconType } from 'react-icons';
import {
  SiArduino,
  SiEspressif,
  SiExpo,
  SiFastapi,
  SiFramer,
  SiGreensock,
  SiNeo4J,
  SiNextdotjs,
  SiNumpy,
  SiNvidia,
  SiPlatformio,
  SiPostgresql,
  SiPython,
  SiRaspberrypi,
  SiReact,
  SiRos,
  SiScikitlearn,
  SiStreamlit,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiUltralytics,
} from 'react-icons/si';

import HubSocials from '@/components/features/hub/HubSocials';
import IslandChat from '@/components/features/hub/IslandChat';
import TrifoldLayout from '@/components/features/hub/trifold/TrifoldLayout';
import { hackathons } from '@/content/hackathons';
import { imageDimensions } from '@/content/project-media';
import { type Project, projects } from '@/content/projects';
import { worlds } from '@/content/worlds';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useWorldLoader } from '@/lib/world-loader-store';

const world = worlds.find((w) => w.id === 'garage') ?? worlds[0];
const ACCENT = world.colorRgb;

const intro =
  'The workshop where projects, tools, and ideas come together. Nine builds spanning mechanical systems, AI infrastructure, and product UX — each a different way to think through a problem, break it down, and refine it until it feels correct.';

/** SolidWorks isn't in Simple Icons (pulled over trademark) — a small local mark. */
function SolidWorksMark(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M16.7 6.6c-1.2-1-2.9-1.6-4.8-1.6-3 0-5.2 1.5-5.2 3.9 0 2 1.5 3.1 4.3 3.7l1.6.35c1.4.3 2 .7 2 1.4 0 .9-1 1.5-2.6 1.5-1.9 0-3.4-.6-4.6-1.7L5.9 17c1.4 1.1 3.4 1.7 5.6 1.7 3.3 0 5.6-1.6 5.6-4 0-2-1.3-3.2-4.2-3.8l-1.6-.34c-1.4-.3-2.1-.6-2.1-1.35 0-.85.9-1.4 2.4-1.4 1.6 0 3 .55 4.1 1.45z" />
    </svg>
  );
}

/** Brand marks keyed by the tool name as it appears in `projects.ts` /
 *  `about.ts`. Anything not here renders with a small accent dot instead. */
const LOGOS: Record<string, { Icon: IconType; color: string }> = {
  SolidWorks: { Icon: SolidWorksMark, color: '#E31E24' },
  'ROS 2': { Icon: SiRos, color: '#E6ECF3' },
  'NVIDIA Jetson': { Icon: SiNvidia, color: '#76B900' },
  ESP32: { Icon: SiEspressif, color: '#E7352C' },
  Arduino: { Icon: SiArduino, color: '#00979D' },
  PlatformIO: { Icon: SiPlatformio, color: '#FF7F00' },
  TypeScript: { Icon: SiTypescript, color: '#3178C6' },
  React: { Icon: SiReact, color: '#61DAFB' },
  'React Native': { Icon: SiReact, color: '#61DAFB' },
  Expo: { Icon: SiExpo, color: '#FFFFFF' },
  PostgreSQL: { Icon: SiPostgresql, color: '#4169E1' },
  'Next.js': { Icon: SiNextdotjs, color: '#FFFFFF' },
  'Tailwind CSS': { Icon: SiTailwindcss, color: '#38BDF8' },
  'Framer Motion': { Icon: SiFramer, color: '#0055FF' },
  GSAP: { Icon: SiGreensock, color: '#0AE448' },
  'Three.js': { Icon: SiThreedotjs, color: '#FFFFFF' },
  Supabase: { Icon: SiSupabase, color: '#3ECF8E' },
  Python: { Icon: SiPython, color: '#5A9FD4' },
  NumPy: { Icon: SiNumpy, color: '#4DABCF' },
  'scikit-learn': { Icon: SiScikitlearn, color: '#F7931E' },
  Streamlit: { Icon: SiStreamlit, color: '#FF4B4B' },
  FastAPI: { Icon: SiFastapi, color: '#05998B' },
  'Raspberry Pi': { Icon: SiRaspberrypi, color: '#C51A4A' },
  YOLOv8: { Icon: SiUltralytics, color: '#6C7BFF' },
  Neo4j: { Icon: SiNeo4J, color: '#4581C3' },
};

/** Curated overview toolbox — real, named tools only (each with a logo).
 *  `[lookup key, display label]`. */
const OVERVIEW_TOOLS: [string, string][] = [
  // Mechanical · embedded
  ['SolidWorks', 'SolidWorks'],
  ['ROS 2', 'ROS 2'],
  ['NVIDIA Jetson', 'Jetson'],
  ['Raspberry Pi', 'Raspberry Pi'],
  ['ESP32', 'ESP32'],
  ['Arduino', 'Arduino'],
  ['PlatformIO', 'PlatformIO'],
  // Web · product · motion
  ['React', 'React'],
  ['Expo', 'Expo'],
  ['Next.js', 'Next.js'],
  ['Three.js', 'Three.js'],
  // Data · backend · ML
  ['Python', 'Python'],
  ['NumPy', 'NumPy'],
  ['scikit-learn', 'scikit-learn'],
  ['YOLOv8', 'YOLOv8'],
  ['Streamlit', 'Streamlit'],
  ['FastAPI', 'FastAPI'],
  ['Supabase', 'Supabase'],
  ['PostgreSQL', 'PostgreSQL'],
  ['Neo4j', 'Neo4j'],
];

const TALLY = [
  { label: 'Projects', value: 9 },
  { label: 'Technologies', value: 20 },
  { label: 'Simulations', value: 50 },
  { label: 'Years Building', value: 3 },
];

const eyebrow = 'mb-3 font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45';

/** One tool row: brand logo (or an accent dot fallback) + name. */
function ToolRow({ name, label }: { name: string; label?: string }) {
  const logo = LOGOS[name];
  return (
    <li title={label ?? name} className="flex items-center gap-2.5">
      {logo ? (
        <logo.Icon
          aria-hidden
          className="h-[18px] w-[18px] flex-shrink-0"
          style={{ color: logo.color }}
        />
      ) : (
        <span
          aria-hidden
          className="flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center"
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: `rgba(${ACCENT}, 0.7)` }}
          />
        </span>
      )}
      <span className="truncate text-sm text-white/85">{label ?? name}</span>
    </li>
  );
}

function Socials() {
  return (
    <div className="mt-auto flex justify-center pt-2">
      <HubSocials accentColor={world.color} accentRgb={world.colorRgb} layout="inline" />
    </div>
  );
}

function TrophyIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-shrink-0 ${className}`}
    >
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
      <path d="M10 14.5V18M14 14.5V18M8 20h8M9 18h6v2H9z" />
    </svg>
  );
}

function PinIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-shrink-0 ${className}`}
    >
      <path d="M12 21s7-6.4 7-11a7 7 0 1 0-14 0c0 4.6 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function LockIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`flex-shrink-0 ${className}`}
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </svg>
  );
}

/** Left-panel hero — an event/org photo with a leading icon, title, and location
 *  beneath, mirroring the hub's `HackathonHero`. `badge` (e.g. "1st Place") is
 *  emphasized as a gold pill over the photo and a "… Winner" prefix. */
function SpotlightHero({
  image,
  title,
  subtitle,
  badge,
  icon,
}: {
  image: string;
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image src={image} alt={title} fill sizes="20rem" className="object-cover" priority />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(7,7,11,0.7) 0%, transparent 45%)' }}
        />
        {badge ? (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-400/20 px-2.5 py-1 shadow-sm backdrop-blur-md">
            <TrophyIcon className="h-3.5 w-3.5 text-amber-200" />
            <span className="text-xs font-bold uppercase tracking-wide text-amber-100">
              {badge}
            </span>
          </div>
        ) : null}
      </div>
      <div className="pt-4 text-white">
        <div className="flex items-center gap-3">
          {icon}
          <span className="text-base font-semibold">{title}</span>
        </div>
        <p className="mt-0.5 pl-8 text-sm text-white/50">
          {badge ? (
            <>
              <span className="font-semibold text-amber-200/90">{badge} Winner</span>
              <span className="text-white/30"> · </span>
            </>
          ) : null}
          {subtitle}
        </p>
      </div>
    </div>
  );
}

/** A selectable project preview in the overview middle panel. */
function ProjectCard({ project, onSelect }: { project: Project; onSelect: (p: Project) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project)}
      className="border-white/8 group block w-full overflow-hidden rounded-2xl border bg-white/[0.03] text-left transition-colors hover:border-[color:var(--world-color)]"
      style={{ ['--world-color' as string]: `rgba(${ACCENT}, 0.5)` }}
    >
      {project.heroImage ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <Image
            src={project.heroImage}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={project.heroPosition ? { objectPosition: project.heroPosition } : undefined}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
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

        <span
          className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold"
          style={{ color: `rgb(${ACCENT})` }}
        >
          View project <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </button>
  );
}

/** Case-study body for the detail middle panel. */
function CaseStudy({ project }: { project: Project }) {
  const rows = (
    [
      ['Situation', project.situation],
      ['Task', project.task],
      ['Action', project.action],
      ['Result', project.solution],
    ] as const
  ).filter(([, value]) => Boolean(value));

  if (rows.length === 0 && !project.lessons?.length) return null;

  return (
    <dl className="border-white/8 mt-6 space-y-3 border-t pt-6 text-sm leading-relaxed text-white/75">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="inline font-mono font-semibold" style={{ color: `rgb(${ACCENT})` }}>
            {label}:
          </dt>{' '}
          <dd className="inline">{value}</dd>
        </div>
      ))}
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
  );
}

/** Gallery of a project's shots — each image at its true aspect ratio
 *  (dimensions from `project-media` so there's no crop and no layout shift).
 *  An all-portrait set (e.g. phone screenshots) is laid out side by side; a
 *  mixed/landscape set flows in a masonry. */
function Gallery({ images, title }: { images: string[]; title: string }) {
  if (images.length === 0) return null;
  const allPortrait = images.every((src) => {
    const [w, h] = imageDimensions[src] ?? [16, 9];
    return h / w >= 1.2;
  });
  // Portrait sets sit side by side; a set of four wraps into a 2×2 grid.
  const cols = images.length === 4 ? 2 : Math.min(images.length, 3);
  return (
    <section className="border-white/8 mt-6 border-t pt-6">
      <p className={eyebrow}>Gallery</p>
      <div
        className={allPortrait ? 'grid gap-3' : 'columns-1 gap-4 sm:columns-2'}
        style={allPortrait ? { gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` } : undefined}
      >
        {images.map((src, i) => {
          const [w, h] = imageDimensions[src] ?? [1600, 900];
          return (
            <figure
              key={src}
              className={`border-white/8 overflow-hidden rounded-xl border bg-black/20 ${
                allPortrait ? '' : 'mb-4 [break-inside:avoid]'
              }`}
            >
              <Image
                src={src}
                alt={`${title} — image ${i + 1}`}
                width={w}
                height={h}
                sizes={
                  allPortrait
                    ? `(min-width: 1024px) ${Math.round(52 / cols)}vw, ${Math.round(92 / cols)}vw`
                    : '(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 90vw'
                }
                className="h-auto w-full"
              />
            </figure>
          );
        })}
      </div>
    </section>
  );
}

/** Preview card for a supporting document (e.g. a design report PDF) — a
 *  first-page thumbnail plus a label that opens the full file in a new tab. */
function ReportCard({ report }: { report: NonNullable<Project['report']> }) {
  const meta = ['PDF', report.pages ? `${report.pages} pages` : null].filter(Boolean).join(' · ');
  return (
    <a
      href={report.url}
      target="_blank"
      rel="noopener noreferrer"
      className="border-white/8 group flex items-stretch gap-4 overflow-hidden rounded-2xl border bg-white/[0.02] p-4 transition-colors hover:border-[color:var(--world-color)]"
      style={{ ['--world-color' as string]: `rgba(${ACCENT}, 0.5)` }}
    >
      {report.cover ? (
        <div className="relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 sm:w-24">
          <Image
            src={report.cover}
            alt={`${report.label ?? 'Report'} cover`}
            fill
            sizes="6rem"
            className="object-cover object-top"
          />
        </div>
      ) : null}
      <div className="flex min-w-0 flex-col justify-center">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-white/45">{meta}</p>
        <h3 className="mt-1 text-lg font-bold text-white">{report.label ?? 'Report'}</h3>
        <span
          className="mt-2 inline-flex items-center gap-1 font-mono text-xs font-semibold"
          style={{ color: `rgb(${ACCENT})` }}
        >
          Read the full report <span aria-hidden>&rarr;</span>
        </span>
      </div>
    </a>
  );
}

/**
 * My Garage — a self-contained trifold that swaps its three panels between an
 * overview (project directory · featured cards · toolbox) and a per-project
 * detail view (short description · hero + case study · tools used), all via
 * client state (no route change). Renders `TrifoldLayout` directly so the panel
 * geometry matches the world loader for a seamless handoff.
 */
export default function GarageWorld() {
  const markReady = useWorldLoader((s) => s.markReady);
  const dismiss = useWorldLoader((s) => s.dismiss);
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<Project | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Signal the world loader to dismiss once the island chrome has painted.
  useEffect(() => {
    let cancelled = false;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) markReady();
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [markReady]);

  // Safety net: force-dismiss the loader if it's somehow still up after 6s.
  useEffect(() => {
    const t = window.setTimeout(() => dismiss(), 6000);
    return () => window.clearTimeout(t);
  }, [dismiss]);

  const select = (p: Project) => {
    setSelected(p);
    scrollRef.current?.scrollTo({ top: 0 });
  };

  const heroHackathon =
    selected?.hackathon ??
    (selected?.hackathonId
      ? (hackathons.find((h) => h.id === selected.hackathonId) ?? null)
      : null);
  const liveLabel = selected?.liveUrl
    ? selected.liveUrl.includes('apps.apple.com')
      ? 'App Store'
      : selected.liveUrl.includes('play.google.com')
        ? 'Google Play'
        : 'Website'
    : null;
  const externalLinks: { label: string; url: string; locked?: boolean }[] = [
    ...(selected?.liveUrl && liveLabel ? [{ label: liveLabel, url: selected.liveUrl }] : []),
    ...(selected?.playUrl ? [{ label: 'Google Play', url: selected.playUrl }] : []),
    ...(selected?.links ?? []),
    ...(selected?.repos ??
      (selected?.githubUrl
        ? [
            {
              label: selected.githubPrivate ? 'GitHub' : 'View on GitHub',
              url: selected.githubUrl,
              locked: selected.githubPrivate,
            },
          ]
        : [])),
  ];

  // ── Left panel ────────────────────────────────────────────────────────────
  const left = selected ? (
    <div className="flex h-full flex-col gap-5 p-6">
      <button
        type="button"
        onClick={() => setSelected(null)}
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Projects
      </button>

      {heroHackathon ? (
        <SpotlightHero
          image={heroHackathon.image}
          title={heroHackathon.name}
          subtitle={heroHackathon.location}
          badge={'award' in heroHackathon ? heroHackathon.award : undefined}
          icon={<TrophyIcon />}
        />
      ) : selected.banner ? (
        <SpotlightHero
          image={selected.banner.image}
          title={selected.banner.name}
          subtitle={selected.banner.location}
          icon={<PinIcon />}
        />
      ) : (
        <>
          <div>
            <h2 className="text-lg font-bold tracking-tight" style={{ color: world.color }}>
              {selected.title}
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-white/70">{selected.description}</p>
        </>
      )}

      {/* Project-scoped assistant — ask questions about this specific build. */}
      <div className="mt-auto pt-2">
        <IslandChat
          key={selected.id}
          projectId={selected.id}
          projectLabel={selected.title.split(':')[0]}
          accentColor={world.color}
          accentRgb={world.colorRgb}
          isMobile={isMobile}
          defaultMinimized={isMobile}
        />
      </div>
    </div>
  ) : (
    <div className="flex h-full flex-col gap-5 p-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-white/65 transition-colors hover:text-white"
      >
        <span aria-hidden>&larr;</span> Hub
      </Link>
      <div>
        <h1 className="text-lg font-bold tracking-tight" style={{ color: world.color }}>
          {world.name}
        </h1>
      </div>
      <p className="text-sm leading-relaxed text-white/60">{intro}</p>
      <nav aria-label="Projects" className="flex flex-col gap-0.5">
        {projects.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => select(p)}
            className="rounded-lg px-3 py-2 text-left text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white lg:border-l-2 lg:border-transparent"
          >
            {p.navLabel ?? p.title.split(':')[0]}
          </button>
        ))}
      </nav>
    </div>
  );

  // ── Center panel ──────────────────────────────────────────────────────────
  const center = (
    <div key={selected?.id ?? 'overview'} ref={scrollRef} className="lg:h-full lg:overflow-y-auto">
      {selected ? (
        <article className="text-white">
          {selected.heroImage ? (
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={selected.heroImage}
                alt={selected.title}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
                style={
                  selected.heroPosition ? { objectPosition: selected.heroPosition } : undefined
                }
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            </div>
          ) : (
            <div className="aspect-[16/9] w-full" style={{ background: `rgba(${ACCENT}, 0.12)` }} />
          )}
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{selected.title}</h1>
            <p className="mt-3 max-w-prose leading-relaxed text-white/70">{selected.description}</p>
            <CaseStudy project={selected} />
            {selected.images?.length ? (
              <Gallery images={selected.images} title={selected.title} />
            ) : null}
          </div>
        </article>
      ) : (
        <div className="text-white">
          <div className="border-b border-white/5 px-6 pb-4 pt-8 sm:px-8">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Featured Projects</h2>
          </div>
          <div className="space-y-6 px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onSelect={select} />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  // ── Right panel ───────────────────────────────────────────────────────────
  const right = selected ? (
    <div className="flex h-full flex-col gap-8 p-6 text-white">
      <section>
        <p className={eyebrow}>Tools &amp; Software</p>
        <ul className="space-y-3">
          {selected.techStack.map((name) => (
            <ToolRow key={name} name={name} />
          ))}
        </ul>
      </section>
      {externalLinks.length > 0 ? (
        <section>
          <p className={eyebrow}>Links</p>
          <div className="space-y-2">
            {externalLinks.map(({ label, url, locked }) =>
              locked ? (
                <div
                  key={url}
                  title="Private repository — not publicly accessible"
                  aria-disabled="true"
                  className="border-white/8 flex cursor-not-allowed items-center justify-between gap-2 rounded-lg border bg-white/[0.02] px-3 py-2 text-sm text-white/50"
                >
                  {label}
                  <span className="flex items-center gap-1.5 text-white/35">
                    <span className="font-mono text-[10px] uppercase tracking-wider">Private</span>
                    <LockIcon />
                  </span>
                </div>
              ) : (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-white/8 flex items-center justify-between gap-2 rounded-lg border bg-white/[0.02] px-3 py-2 text-sm text-white/70 transition-colors hover:border-white/15 hover:text-white"
                >
                  {label}
                  <span aria-hidden className="text-white/30">
                    &rarr;
                  </span>
                </a>
              ),
            )}
          </div>
        </section>
      ) : null}
      {selected.report ? (
        <section>
          <p className={eyebrow}>Report</p>
          <ReportCard report={selected.report} />
        </section>
      ) : null}
      <Socials />
    </div>
  ) : (
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

  return (
    <TrifoldLayout
      colorRgb={world.colorRgb}
      lead={
        <a
          href="#garage-main"
          className="sr-only fixed left-4 top-4 z-[100] rounded bg-cyan-400 px-4 py-2 font-mono text-sm text-black focus:not-sr-only"
        >
          Skip to content
        </a>
      }
      left={{ as: 'aside', panelProps: { 'aria-label': 'Project navigation' }, children: left }}
      center={{
        as: 'main',
        panelProps: { id: 'garage-main', tabIndex: -1, 'aria-label': world.name },
        children: center,
      }}
      right={{ as: 'aside', panelProps: { 'aria-label': 'Project details' }, children: right }}
    />
  );
}
